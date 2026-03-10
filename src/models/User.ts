import { StoredFile } from "./StoredFile.js";

export class User {
  constructor(
    readonly id: number,
    readonly uuid: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,

    private _username: string,
    private _email: string,
    private _phone: string,
    private _passwordHash: string,

    private _role: Role,
    private _jobTitle: JobTitle,
    private _profilePicture: StoredFile | null,
    private _userBoards: UserBoard[],
    private _quickEmergencyBoard: QuickEmergencyBoard | null,
    private _userPhrases: UserPhrases[],
    private _authoredBoards: Board[],
    private _storedFiles: StoredFile[],
  ) {}

  public get username() {
    return this._username;
  }

  public get email() {
    return this._email;
  }

  public get phone() {
    return this._phone;
  }

  public get passwordHash() {
    return this._passwordHash;
  }

  public get role() {
    return this._role;
  }

  public get jobTitle() {
    return this._jobTitle;
  }

  public get profilePicture() {
    return this._profilePicture;
  }

  public get userBoards() {
    return this._userBoards;
  }

  public get quickEmergencyBoard() {
    return this._quickEmergencyBoard;
  }

  public get userPhrases() {
    return this._userPhrases;
  }

  public get authoredBoards() {
    return this._authoredBoards;
  }

  public get storedFiles() {
    return this._storedFiles;
  }

  public set username(username: string) {
    this._username = username;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set phone(phone: string) {
    this._phone = phone;
  }

  public set passwordHash(passwordHash: string) {
    this._passwordHash = passwordHash;
  }

  public set role(role: Role) {
    this._role = role;
  }

  public set userBoards(boards: UserBoard[]) {
    this._userBoards = boards;
  }

  public set quickEmergencyBoard(board: QuickEmergencyBoard | null) {
    this._quickEmergencyBoard = board;
  }

  public set userPhrases(phrases: UserPhrase[]) {
    this._userPhrases = phrases;
  }

  public set authoredBoards(boards: Board[]) {
    this._authoredBoards = boards;
  }
}
