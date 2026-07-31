import { formatDate } from "../formatDate";

describe("formatDate", () => {
  it("formats an ISO date string to dd.MM.yyyy", () => {
    expect(formatDate("2024-03-15T10:00:00.000Z")).toBe("15.03.2024");
  });

  it("formats a date-only string", () => {
    expect(formatDate("2023-01-07")).toBe("07.01.2023");
  });

  it("formats a date with single-digit month and day", () => {
    expect(formatDate("2022-05-03")).toBe("03.05.2022");
  });
});
