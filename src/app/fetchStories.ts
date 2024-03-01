import axios, { AxiosResponse } from "axios";

import { Story } from "../models";

const isObject = (obj: unknown): obj is object => obj === Object(obj);
const STORIES_PROP_NAME = "hits";
const isValidResponseBody = (body: unknown): body is { [STORIES_PROP_NAME]: Story[] } => isObject(body) && STORIES_PROP_NAME in body;

const HN_API_BASE_URL = "https://hn.algolia.com"
export const fetchStories = (query: string): Promise<Story[]> => axios.get(`${HN_API_BASE_URL}/api/v1/search?query=${query}`)
  .then((res: AxiosResponse<unknown>): unknown => res.data)
  .then((body: unknown): Story[] => {
    if (isValidResponseBody(body)) {
      return body.hits;
    }

    throw new TypeError("Invalid response body.");
  });
