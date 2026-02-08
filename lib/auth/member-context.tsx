"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MemberData {
  id: string;
  full_name: string;
  mobile: string;
  membership_type: string;
  end_date: string;
}

interface MemberAuthContextType {
  member: MemberData | null;
  login: (data: MemberData) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const MemberAuthContext = createContext<MemberAuthContextType>({
  member: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gym_member");
    if (saved) {
      try {
        setMember(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const login = (data: MemberData) => {
    setMember(data);
    localStorage.setItem("gym_member", JSON.stringify(data));
  };

  const logout = () => {
    setMember(null);
    localStorage.removeItem("gym_member");
  };

  return (
    <MemberAuthContext.Provider value={{ member, login, logout, isAuthenticated: !!member }}>
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  return useContext(MemberAuthContext);
}
