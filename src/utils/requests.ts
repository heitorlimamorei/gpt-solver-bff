import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

export async function get<T>(url: string): Promise<T>  {
    const { data } = await axios.get(url, {baseURL: process.env.MICROSERVICE_BASE_URL})
    return data as T;
}

export async function post<T, R>(url: string, payload: T): Promise<R> {
    const { data } = await axios.post(url, payload, {baseURL: process.env.MICROSERVICE_BASE_URL})
    return data as R;
}

export const PromiseScheduler = async <T>(promises: Promise<T>[]): Promise<T[]> => {
    return await Promise.all([...promises]);   
}