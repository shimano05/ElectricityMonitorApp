// token & refreshToken取得クエリ
export const getTokenQuery = `
mutation login($input: ObtainJSONWebTokenInput!) {
obtainKrakenToken(input: $input) {
token
refreshToken
}
}
`;

// 電気使用量や料金のデータ取得クエリ
export const getEnergyDataQuery = `
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
