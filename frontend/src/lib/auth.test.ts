import { beforeEach, describe, expect, it } from "vitest";
import { clearToken, getToken, isLoggedIn, saveToken } from "@/lib/auth";

describe("auth token helpers", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saveToken / getToken でトークンを保存・取得できる", () => {
    saveToken("test-token-abc");
    expect(getToken()).toBe("test-token-abc");
    expect(isLoggedIn()).toBe(true);
  });

  it("clearToken でトークンを削除できる", () => {
    saveToken("test-token-abc");
    clearToken();
    expect(getToken()).toBeNull();
    expect(isLoggedIn()).toBe(false);
  });
});
