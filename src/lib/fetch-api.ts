
const headers: { "Content-Type": string; Authorization?: string } = {
  "Content-Type": "application/json",
};

export class FetchApi {
  constructor() {}

  public async Get<T>(url:string):Promise<T>{
    const res = await fetch(url,{
      method: 'GET',
      headers:headers,
    })
    return await res.json()
  }

  public Post<T>(path: string, data: T): Promise<T[]> {
    return fetch(path, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log("err | ", err);
      });
  }

  public Put<T>(path: string, data: T) {
    return fetch(path, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log("err | ", err);
      });
  }

  public Delete<T>(path: string, data: T) {
    return fetch(path, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.log("err | ", err);
      });

  }
} 
