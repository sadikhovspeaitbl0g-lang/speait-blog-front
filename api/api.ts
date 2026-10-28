import axios from "axios";

export type ArticleData = {
  _id: string;
  title: string;
  description: string;
  content: string;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
};

export type TypedResult<T> = {
  isSuccess: boolean,
  message: string,
  data: T
}

export type Result = {
  isSuccess: boolean,
  message: string,
}

export type CreateArticleData = Omit<
  ArticleData,
  "_id" | "updatedAt"
>;

export type UpdateArticleData = CreateArticleData & {
  id: string;
};

type CredentialsResponse = {
  isSuccess: boolean;
  message?: string;
};

const backend =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_BACKEND_DEVELOPMENT
    : process.env.NEXT_PUBLIC_BACKEND_PRODUCTION;

if (!backend) {
  throw new Error("Backend URL is not configured");
}

const baseURL = backend.replace(/\/+$/, "");

const articlesApi = axios.create({
  baseURL: `${baseURL}/api/articles`,
});

const usersApi = axios.create({
  baseURL: `${baseURL}/api/users`,
});

export const checkCredentials = async (
  username: string,
  password: string
): Promise<CredentialsResponse> => {
  const response = await usersApi.post<CredentialsResponse>("/check", {
    username,
    password,
  });

  return response.data;
};

export const createArticle = async (data: CreateArticleData) => {
  const response = await articlesApi.post("/create", data);
  return response.data;
};

export const updateArticle = async ({
  id,
  ...data
}: UpdateArticleData) => {
  const response = await articlesApi.put<Result>(
    `/update/${encodeURIComponent(id)}`,
    data
  );
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await articlesApi.delete<Result>(
    `/delete/${encodeURIComponent(id)}`
  );

  return response.data;
};

export const getById = async (id: string): Promise<TypedResult<ArticleData>> => {
  const response = await articlesApi.get<TypedResult<ArticleData>>(
    `/get/${encodeURIComponent(id)}`
  );

  return response.data;
};

export const getPaginated = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = ""
) => {
  const response = await articlesApi.get("/get-paginated", {
    params: { page, pageSize, search },
  });

  return response.data;
};