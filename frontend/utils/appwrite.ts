import { Client, Storage } from "appwrite";

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject('684c67e7003412a1258f');

const storage = new Storage(client);

export { client, storage };