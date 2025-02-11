export interface TDataUser {
    numberOfRents?: number;
    totalAverageWeightRatings?: number;
    recentlyActive?: string;
    id?: string;
    name?: string;
    email?: string;
}

export interface TDataLogin { email: string; password: string }
export interface TDataRegister extends TDataLogin {
    name: string,
    confirmPassword?: string
}
export interface InitialStateLogin { postLoginSuccess: boolean, postLoginError: string; postLoginLoading: boolean; modifiedData: TDataLogin }
export interface InitialStateUser { users: TDataUser[]; getUsersLoading: boolean; getUsersError: string | null | unknown; updateUserLoading: boolean; updateUserMessage: string; updateUserSuccess: boolean }
export interface InitialStateDialog { openDialog: boolean; rating: number; selectedUser: string; openDialogAdd: boolean }
export interface InitialStateTable { page: number; rowsPerPage: number }
export interface StateReducer {
    login: InitialStateLogin
    users: InitialStateUser
    dialog: InitialStateDialog
    table: InitialStateTable
}
