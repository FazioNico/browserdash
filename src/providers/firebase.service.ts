// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";
import { firebaseConfig } from "../environements/environement.prod";
import { log } from "../helpers/utils";

export interface IFbService {
  auth: firebase.auth.Auth;
  database: firebase.database.Database,
  signIn: () => Promise<firebase.auth.UserCredential>
  push: (ref: string, data: any) => Promise<any>
  set: (ref: string, data: any) => Promise<any>
  update: (ref: string, data: any) => Promise<any>
  remove: (ref: string) => Promise<any>
}

class FirebaseService implements IFbService {

  private _auth: firebase.auth.Auth;
  public get auth(): firebase.auth.Auth {
    return this._auth;
  }
  private _database: firebase.database.Database;
  public get database(): firebase.database.Database {
    return this._database;
  }
  private _googleProvider: firebase.auth.GoogleAuthProvider;

  constructor(config: Object) {
    // Initialize Firebase
    this._init(config);
  }

  private _init(config: Object): void {
    log('init firebase...');
    firebase.initializeApp(config);
    this._auth = firebase.auth();
    this._database = firebase.database();
    this._googleProvider = new firebase.auth.GoogleAuthProvider();
  }

  async push(referance: string, data: any): Promise<any>{
    return await this._database.ref(referance).push(data);
  }

  async set(referance: string, data: any): Promise<any>{
    return await this._database.ref(referance).set(data);
  }

  async update(referance: string, data: any): Promise<any>{
    return await this._database.ref(referance).update(data);
  }

  async remove(referance: string): Promise<any>{
    return await this._database.ref(referance).remove();
  }

  async signIn(): Promise<firebase.auth.UserCredential> {
    return await this.auth
      .signInWithPopup(this._googleProvider)
      .catch((error)=> {
        // Handle Errors here.
        console.log(error);
        return error;
      });
  }
}


const fbService: FirebaseService =  new FirebaseService(firebaseConfig);
export default Object.freeze(fbService);