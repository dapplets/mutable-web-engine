import { SocialDbStorage } from "../../../src/providers/social-db-storage";

describe("SocialDbStorage", () => {
  it("builds chain of keys by given global id", () => {
    // Arrange
    const input = "bos.dapplets.near/app/Paywall";
    const expected = [
      "bos.dapplets.near",
      "settings",
      "dapplets.near",
      "app",
      "Paywall",
    ];

    // Act
    const actual = SocialDbStorage._buildKeysFromId(input);

    // Assert
    expect(actual).toEqual(expected);
  });

  it("extracts object by keys with delimiters", () => {
    // Arrange
    const keys = ["one", "two", "three"];
    const obj = {
      one: {
        two: {
          three: {
            "": "self",
            four: "test",
          },
        },
      },
    };
    const expected = { "": "self", four: "test" };

    // Act
    const actual = SocialDbStorage._getValueByKey(keys, obj);

    // Assert
    expect(actual).toEqual(expected);
  });

  it("builds nested data by specific keys", () => {
    // Arrange
    const keys = ["one", "two", "three"];
    const obj = { "": "self", four: "test" };
    const expected = {
      one: {
        two: {
          three: {
            "": "self",
            four: "test",
          },
        },
      },
    };

    // Act
    const actual = SocialDbStorage._buildNestedData(keys, obj);

    // Assert
    expect(actual).toEqual(expected);
  });

  it("get by id", async () => {
    // Arrange
    const mockSocialDbClient = {
      get: jest.fn(() => ({
        "bos.dapplets.near": {
          settings: {
            "dapplets.near": {
              parser: { twitter: { test: "test" } },
            },
          },
        },
      })),
    };
    const socialDb = new SocialDbStorage(mockSocialDbClient as any);
    const id = "bos.dapplets.near/parser/twitter";
    const expected = { test: "test" };

    // Act
    const actual = await socialDb.getById(id);

    // Assert
    expect(actual).toEqual(expected);
  });

  it("set by id", async () => {
    // Arrange
    const mockSocialDbClient = {
      set: jest.fn(),
    };
    const socialDb = new SocialDbStorage(mockSocialDbClient as any);
    const id = "bos.dapplets.near/parser/twitter";
    const expectedArgument = {
      "bos.dapplets.near": {
        settings: {
          "dapplets.near": {
            parser: { twitter: { test: "test" } },
          },
        },
      },
    };
    const dataToWrite = { test: "test" };

    // Act
    await socialDb.setById(id, dataToWrite);

    // Assert
    expect(mockSocialDbClient.set).toHaveBeenCalledWith(expectedArgument);
  });

  it("set by long id", async () => {
    // Arrange
    const mockSocialDbClient = {
      set: jest.fn(),
    };
    const socialDb = new SocialDbStorage(mockSocialDbClient as any);
    const id = "bos.dapplets.near/parser/twitter/subid";
    const expectedArgument = {
      "bos.dapplets.near": {
        settings: {
          "dapplets.near": {
            parser: { twitter: { subid: { test: "test" } } },
          },
        },
      },
    };
    const dataToWrite = { test: "test" };

    // Act
    await socialDb.setById(id, dataToWrite);

    // Assert
    expect(mockSocialDbClient.set).toHaveBeenCalledWith(expectedArgument);
  });

  it("get id keys by given query", async () => {
    // Arrange
    const mockSocialDbClient = {
      keys: jest.fn(() => [
        "bos.dapplets.near/settings/dapplets.near/parser/one",
        "bos.dapplets.near/settings/dapplets.near/parser/two",
      ]),
    };
    const socialDb = new SocialDbStorage(mockSocialDbClient as any);
    const query = "*/parser/*";
    const expected = [
      "bos.dapplets.near/parser/one",
      "bos.dapplets.near/parser/two",
    ];

    // Act
    const actual = await socialDb.getKeys(query);

    // Assert
    expect(actual).toEqual(expected);
  });
});
