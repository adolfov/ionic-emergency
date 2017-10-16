export interface Profile {
  name: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface Contact {
  id: string;
  name?: string;
  phone?: string;
  sms?: boolean;
}
