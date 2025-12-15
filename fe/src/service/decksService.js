import httpClient from "../config/httpClient";
import { API } from "../config/configuration";
import { getToken } from "./localStorageService";

export const getAllDecks = async () => {
  const url = API.GET_ALL_DECKS;
  try {
    const response = await httpClient.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching decks:", error);
    throw error;
  }
};

export const getDeckById = async (id) => {
  const url = API.GET_DECK(id);
  try {
    const response = await httpClient.get(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching deck by id:", error);
    throw error;
  }
};

export const createDecks = async (flashcardsRequests, decksRequest) => {
  const url = API.DECKS;
  try {
    // Backend expects two bodies which is unusual; assuming it accepts one object aggregating both
    const payload = { flashcardsRequests, decksRequest };
    const response = await httpClient.post(url, payload, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating decks:", error);
    throw error;
  }
};
