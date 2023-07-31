# ElectricityMonitorApp

# ElectricityHalfHourReading（電力の半時読み取り）

ElectricityHalfHourReading は、GraphQL のデータ型の一つであり、電力使用量の測定に関連して使用されます。特に、電力の使用量を 30 分ごとに記録する際に使われます。

このデータ型に含まれるフィールドは以下の通りです：

- `startAt`: DateTime!: インターバル期間の開始時刻を表す DateTime 型のデータ。
- `endAt`: DateTime!: インターバル期間の終了時刻を表す DateTime 型のデータ。開始時刻から 30 分後の時刻になります。
- `value`: Decimal!: インターバル期間中の消費電力量（kWh）を表す Decimal 型のデータ。
- `costEstimate`: Decimal!: 使用量に対する見積もりの電力料金を表す Decimal 型のデータ。
- `version`: HalfHourlyReadingsVersions!: 半時読み取りのバージョンを表す HalfHourlyReadingsVersions 型のデータ。
- `consumptionRateBand`: String!: この読み取りが適用される電力料金の消費プロダクトレートバンドを表す文字列型のデータ。
- `consumptionStep`: Int!: FED タイプのチェック用のプレースホルダーであり、近日中に削除される予定です。

これらのフィールドによって、特定の期間中の電力の消費量や料金を把握することができます。`startAt`と`endAt`は各期間の開始と終了時刻を示し、`value`にはその期間の消費電力量（kWh）が含まれます。また、`costEstimate`にはその期間の電力使用に対する見積もりの料金が含まれています。

`version`や`consumptionRateBand`などは、特定のデータや料金プランに関連する情報を提供します。

これらのフィールドを使用して、電力の使用量や料金に関する情報を GraphQL のクエリやミューテーションを通じて取得したり、利用したりすることができます。GraphQL を使用することで、必要な情報を効率的に取得できるため、電力モニタリングや料金計算などに役立てられるでしょう。
