import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { timestamp } from "@/utils/Time";
import { factory } from "@/utils/ConfigLog4j";
import { localStorage } from "@/utils/LocalStorage";

const logger = factory.getLogger("Utils.WebService");

type HttpMethod =
  | "get"
  | "delete"
  | "head"
  | "options"
  | "post"
  | "put"
  | "patch"
  | "link"
  | "unlink"
  | "GET"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "POST"
  | "PUT"
  | "PATCH"
  | "LINK"
  | "UNLINK"
  | undefined;

type ResponseType =
  | "json"
  | "arraybuffer"
  | "blob"
  | "document"
  | "text"
  | "stream"
  | undefined;

export class WebService {
  private _url = "";
  private _method: HttpMethod = undefined;
  private _headers: any = {};
  private _responseType: ResponseType = "json";

  private _requestSerializer(request: any | undefined): any {
    if (request == undefined) {
      return undefined;
    }
    return JSON.stringify(request);
  }

  public url(url: string): WebService {
    this._url = url;
    return this;
  }
  public header(name: string, value: string): WebService {
    this._headers[name] = value;
    return this;
  }
  public responseType(
    responseType:
      | "json"
      | "arraybuffer"
      | "blob"
      | "document"
      | "text"
      | "stream"
      | undefined
  ): WebService {
    this._responseType = responseType;
    return this;
  }
  public headerJson(): WebService {
    this.header("Content-Type", "application/json; charset=utf-8");
    return this;
  }
  public method(method: HttpMethod): WebService {
    this._method = method;
    return this;
  }
  public get(): WebService {
    return this.method("get");
  }
  public delete(): WebService {
    return this.method("delete");
  }
  public post(): WebService {
    return this.method("post");
  }
  public put(): WebService {
    return this.method("put");
  }
  public patch(): WebService {
    return this.method("patch");
  }
  public requestSerializer(serializer: (request: any) => any): WebService {
    this._requestSerializer = serializer;
    return this;
  }

  public call(payload: any | undefined = undefined) {
    const startTime = timestamp();
    const instance = axios.create();

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      logger.debug(`Call ${config.url} start`);
      return config;
    });
    instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        const duration = timestamp() - startTime;
        logger.info(
          `Call ${response.config.url} end [${duration}] status [${response.status}] ${response.statusText}`
        );
        return response;
      },
      (error: any) => {
        const duration = timestamp() - startTime;
        logger.error(() => `Call ${error.config.url} failed [${duration}]`);
        throw { data: error.response.data };
      }
    );

    instance.interceptors.request.use((config: AxiosRequestConfig) => {
      return config;
    });

    instance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response;
      },
      (error: any) => {
        throw error;
      }
    );
    const serializedPayload = this._requestSerializer(payload);
    return instance({
      url: this._url,
      method: this._method,
      headers: this._headers,
      responseType: this._responseType,
      data: serializedPayload,
    });
  }
}

export class BackendWebService extends WebService {
  public url(url: string): WebService {
    const fullUrl = process.env.VUE_APP_BACKEND_API + url;
    logger.debug(`URL: ${url} WindowLocation: ${window.location}`);
    return super.url(fullUrl);
  }
}
