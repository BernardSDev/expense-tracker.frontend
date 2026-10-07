import {apiRequest} from "./api";

const CATEGORIES_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/Categories`;

export function getCategories() {
    return apiRequest(CATEGORIES_API_URL);
}