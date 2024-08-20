
import { Account, Avatars, Client, Databases, ID,  Query,
    Storage, } from 'react-native-appwrite';

export const appwriteConfig ={
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '66b34ca3000c23bd5ab4',
    databaseId: '66b34da000116eb63fa5',
    userCollectionId: '66b34dc5000b8992f040',
    videoCollectionId: '66b34df1002696147cb5',
    storageId: '66b34f89002ebe77cad3'
}
const{
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

// Init your React Native SDK
const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async(email, password, username) =>{

    try {
        const newAccount = await account.create(
            ID.unique(),
            email, 
            password,
            username
        )
        console.log(newAccount)

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)
    
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl
            }

        )
        newAccount.get;
        console.log(newAccount.get)
        return newUser;
    } catch (error) {
        if(error.code == 401) {
            await signIn(email, password)
        }
        console.log(error)
        throw new Error(error)
    }
}


// Sign In
export async function signIn2(email, password) {
    try {
        
        const account = new Account(client);
        const result = await account.get();

      console.log(result)
      return result
    } catch (error) {
        if(error.code == 401) {
            // not logged int
            const session = await account.createEmailPasswordSession(email, password);
            console.log(session)
            return session;
        } 
      throw new Error(error);
    }
}
  
// Sign In
export const  signIn = async(email, password) =>{
    try {
      const session = await account.createEmailPasswordSession(email, password);
      console.log(session)
      return session;
    } catch (error) {
      console.log("email", email)
      throw new Error(error);
    }
}
  
  export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

  // Get Current User
export const getCurrentUser = async()=> {
    try {
      const currentAccount = await getAccount();
      if (!currentAccount) throw Error;
  
      const currentUser = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  // Sign Out
export async function signOut() {
    try {
      const session = await account.deleteSessions('current');
  
      return session;
    } catch (error) {
      console.log(error)
      throw new Error(error);
    }
  }
  
  // Upload File
  export async function uploadFile(file, type) {
    if (!file) return;
  
    const { mimeType, ...rest } = file;
    const asset = { 
      name: file.name,
      type: file.mimeType,
      size: file.size,
      uri: file.uri
     };
  
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get File Preview
  export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Create Video Post
  export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get all video Posts
  export async function getAllPosts() {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc("$createdAt")]
      
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get video posts created by user
  export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.equal("creator", userId),Query.orderDesc("$createdAt")]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get video posts that matches search query
  export async function searchPosts(query) {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.search("title", query)]
      );
  
      if (!posts) throw new Error("Something went wrong");
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Get latest created video posts
  export async function getLatestPosts() {
    try {
      const posts = await databases.listDocuments(
        databaseId,
        videoCollectionId,
        [Query.orderDesc("$createdAt"), Query.limit(7)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }