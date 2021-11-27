import axios from "axios";

export const getData = async (url: string, method: any, body?: any) => {
  const response = await axios({
    url,
    method,
    data: body || {},
  });

  return response;
};
