interface ReportMessage {
  errorDetail: string | false | object;
  responseDetail: string | false | object;
  url: string;
  status: number;
  body: any;
  headers: any;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const sendReportMessage = async (message: ReportMessage) => {
  // send your message to third party service
};
