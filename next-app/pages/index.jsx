import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [loginToken, setLoginToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");

  // "OctopusEnergyJapan" APIURL
  const apiURL = process.env.NEXT_PUBLIC_API_URL;

  // マイページにログインする際に使用する "email"
  const octopusEmail = process.env.NEXT_PUBLIC_OCTOPUS_EMAIL;

  // マイページにログインする際に使用する "password"
  const octopusPassword = process.env.NEXT_PUBLIC_OCTOPUS_PASSWORD;

  // token & refreshToken発行クエリ
  const getTokenQuery = `
mutation login($input: ObtainJSONWebTokenInput!) {
obtainKrakenToken(input: $input) {
token
refreshToken
}
}
`;

  // クエリ変数
  const variables = {
    input: {
      email: octopusEmail,
      password: octopusPassword,
    },
  };

  useEffect(() => {
    // token & refreshToken発行
    const getLoginToken = async () => {
      try {
        const res = await axios.post(apiURL, {
          query: getTokenQuery,
          variables: variables,
        });

        const { token, refreshToken } = res.data.data.obtainKrakenToken;
        setLoginToken(token);
        setRefreshToken(refreshToken);
      } catch (error) {
        console.error("Error", error);
      }
    };
    getLoginToken();
  }, []);

  return (
    <div>
      <p>loginToken:{loginToken}</p>
      <p>refreshToken:{refreshToken}</p>
    </div>
  );
}
