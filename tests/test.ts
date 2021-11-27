import { getData } from "./index.test";

const URL = "https://xxxxxx.execute-api.us-east-1.amazonaws.com";

describe("Check all endpoints", () => {
  let employeeUuid: string;

  const employee = {
    employeeId: 1,
    employeeName: "John Doe",
    employeeAge: 30,
    employeeRole: "admin",
  };

  it("should create a employee", async () => {
    const result = await getData(`${URL}/employees`, "POST", employee);

    expect(result.status).toBe(200);
    expect(result.data.message.uuid).toBeTruthy();

    employeeUuid = result.data.message.uuid;
  });

  it("should get all employees", async () => {
    const result = await getData(`${URL}/employees`, "GET");

    expect(result.status).toBe(200);
    expect(result.data.message.length).toBeGreaterThanOrEqual(1);
  });

  it("should get the employee", async () => {
    const result = await getData(`${URL}/employees/${employeeUuid}`, "GET");

    expect(result.status).toBe(200);
    expect(result.data.message.uuid).toBe(employeeUuid);
  });

  it("should update the employee", async () => {
    const result = await getData(`${URL}/employees/${employeeUuid}`, "PUT", {
      ...employee,
      employeeName: "Doe John",
    });

    expect(result.status).toBe(200);
    expect(result.data.message.employeeName === employee.employeeName).toBeFalsy();
  });

  it("should delete the employee", async () => {
    const result = await getData(`${URL}/employees/${employeeUuid}`, "DELETE");

    expect(result.status).toBe(200);

    expect(result.data.message.uuid).toBe(employeeUuid);
  });
});
