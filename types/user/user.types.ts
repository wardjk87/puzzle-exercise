type UserCustomFields = {
  readonly c1: any;
  readonly c2: any;
  readonly c3: any;
}

type UserType = {
  readonly id: string;
  readonly name: string;
  readonly customFields: Readonly<UserCustomFields>;
}

type User = {
  readonly email: string;
  readonly externalId: string;
  readonly id: string;
  readonly name: string;
  readonly type: Readonly<UserType>;
}

export type { User };