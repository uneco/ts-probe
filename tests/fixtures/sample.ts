interface User {
  id: string;
  name: string;
  age: number;
}

interface StoredUser extends User {
  storedAt: Date;
}
