import { ReactNode } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  type PageProps<T = any> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Promise<any>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  };
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  type LayoutProps<T = any> = {
    children: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: Promise<any>;
  };
}

export {};
