export interface Password_reset_token {
  id: number;
  user_id: number;
  token: string;
  expiration: string;
}
