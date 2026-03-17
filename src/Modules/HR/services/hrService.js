import {
  get_form_track,
  search_employees,
  submit_cpda_claim_form,
} from "../../../routes/hr";
import { authorizedFetch } from "./api";

const fetchJson = async (url) => {
  const response = await authorizedFetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
};

export const fetchHrCollection = async (url, responseKey) => {
  const data = await fetchJson(url);
  return data?.[responseKey] || [];
};

export const fetchHrTrackHistory = async (id) => {
  const data = await fetchJson(get_form_track(id));
  return data?.file_history || [];
};

export const searchEmployees = (searchText) =>
  authorizedFetch(
    `${search_employees}?search_text=${encodeURIComponent(searchText)}`,
  );

export const submitCpdaClaimForm = (formData) =>
  authorizedFetch(submit_cpda_claim_form, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
