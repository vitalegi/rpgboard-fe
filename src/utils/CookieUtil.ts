class CookieUtil {
  public setCookie(
    key: string,
    value: string,
    maxAge: number = 60 * 60 * 24 * 365
  ) {
    document.cookie = `${key}=${value};path=/;max-age=${maxAge};secure;samesite=strict`;
  }
  public getCookie(key: string): string | undefined {
    return document.cookie
      .split(";")
      .find((item) => item.trim().startsWith(`${key}=`))
      ?.split("=")[1];
  }
  public hasCookie(key: string): boolean {
    return (
      document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(`${key}=`)) !== null
    );
  }
  public getCookies(): Array<string> {
    return document.cookie.split(";");
  }
}

export const cookieUtil = new CookieUtil();
