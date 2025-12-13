const BASE = "http://localhost:3000/api";

export const getSummary = () =>
  fetch(`${BASE}/stats/summary`).then(r => r.json());

export const getErrors = () =>
  fetch(`${BASE}/errors`).then(r => r.json());

export const getErrorById = (id) =>
  fetch(`${BASE}/errors/${id}`).then(r => r.json());

export const getRepeatedErrors = () =>
  fetch(`${BASE}/errors/repeated`).then(r => r.json());

export const getModuleRisk = () =>
  fetch(`${BASE}/modules/risk`).then(r => r.json());
