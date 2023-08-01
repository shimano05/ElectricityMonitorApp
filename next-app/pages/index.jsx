import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [loginToken, setLoginToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [energyData, setEnergyData] = useState();
  const [totalKwh, setTotalKwh] = useState(0);
  const [totalCostEstimate, setTotalCostEstimate] = useState(0);

  // "OctopusEnergyJapan" APIURL
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // マイページにログインする際に使用する "email"
  const octopusEmail = process.env.NEXT_PUBLIC_OCTOPUS_EMAIL;

  // マイページにログインする際に使用する "password"
  const octopusPassword = process.env.NEXT_PUBLIC_OCTOPUS_PASSWORD;

  // accountNumberの値を環境変数から取得
  const octopusAccountNumber = process.env.NEXT_PUBLIC_OCTOPUS_ACCOUNT_NUMBER;

  // token & refreshToken取得クエリ
  const getTokenQuery = `
mutation login($input: ObtainJSONWebTokenInput!) {
obtainKrakenToken(input: $input) {
token
refreshToken
}
}
`;

  // 電気使用量や料金のデータ取得クエリ
  const getEnergyDataQuery = `
	query halfHourlyReadings(
		$accountNumber: String!
		$fromDatetime: DateTime
		$toDatetime: DateTime
	) {
		account(accountNumber: $accountNumber) {
			properties {
				electricitySupplyPoints {
					agreements {
						validFrom
					}
					halfHourlyReadings(
						fromDatetime: $fromDatetime
						toDatetime: $toDatetime
					) {
						startAt
            endAt
						value
						costEstimate
					}
				}
			}
		}
	}
`;

  // token&refreshTokenクエリ変数
  const tokenVariables = {
    input: {
      email: octopusEmail,
      password: octopusPassword,
    },
  };

  // const today = new Date();
  // const toDayYear = today.getFullYear();
  // const todayMonth = today.getMonth() + 1;
  // const todayDay = today.getDate();

  // const yesterday = new Date();
  // yesterday.setDate(yesterday.getDate() - 1);
  // const yesterdayYear = yesterday.getFullYear();
  // const yesterdayMonth = yesterday.getMonth() + 1;
  // const yesterdayDay = yesterday.getDate();

  const yesterdayYear = "2023";
  const yesterdayMonth = "07";
  const yesterdayDay = "30";
  const toDayYear = "2023";
  const todayMonth = "07";
  const todayDay = "31";

  const energyVariables = {
    accountNumber: octopusAccountNumber,
    fromDatetime: `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}T00:00:00.000Z`,
    toDatetime: `${toDayYear}-${todayMonth}-${todayDay}T00:00:00.000Z`,
  };

  useEffect(() => {
    // token & refreshToken発行
    const getLoginToken = async () => {
      try {
        const res = await axios.post(apiURL, {
          query: getTokenQuery,
          variables: tokenVariables,
        });
        console.log("getLoginToken", res.status);
        const { token, refreshToken } = res.data.data.obtainKrakenToken;
        setLoginToken(token);
        setRefreshToken(refreshToken);
      } catch (error) {
        console.error("Error", error);
      }
    };
    getLoginToken();
  }, []);

  const getEnergyData = async () => {
    try {
      const res = await axios.post(
        apiURL,
        {
          query: getEnergyDataQuery,
          variables: energyVariables,
        },
        { headers: { Authorization: loginToken } }
      );
      console.log("getEnergyData", res.status);
      const { halfHourlyReadings } =
        res.data.data.account.properties[0].electricitySupplyPoints[0];

      setEnergyData(halfHourlyReadings);
      getTotalKwh(halfHourlyReadings);
      getTotalCostEstimate(halfHourlyReadings);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const getTotalKwh = (halfHourlyReadings) => {
    const total = halfHourlyReadings.reduce(
      (total, item) => total + Number(item.value),
      0
    );

    setTotalKwh(total);
  };

  const getTotalCostEstimate = (halfHourlyReadings) => {
    const total = halfHourlyReadings.reduce(
      (total, item) => total + Number(item.costEstimate),
      0
    );

    setTotalCostEstimate(total);
  };

  return (
    <div>
      <button onClick={getEnergyData}>昨日のデータを取得する</button>
      <h1>昨日のデータ</h1>
      {energyData ? (
        <div>
          <p>{`トータル電気使用量：${Math.round(totalKwh * 10) / 10}kWh`}</p>
          <p>
            {`トータル電気料金：約${
              Math.round(totalCostEstimate * 100) / 100
            }円`}
          </p>
        </div>
      ) : (
        <div>
          <p>{`トータル電気使用量：Loding...`}</p>
          <p>{`トータル電気料金：Loding...`}</p>
        </div>
      )}
    </div>
  );
}
