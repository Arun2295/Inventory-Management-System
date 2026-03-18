import { useAuth } from "../context/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { LogOut, User as UserIcon } from "lucide-react";

export function Home() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserIcon className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome, {user?.username}!
          </CardTitle>
          <CardDescription>You are successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Username:
              </span>
              <span className="text-sm font-semibold">{user?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Email:
              </span>
              <span className="text-sm font-semibold">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Role:
              </span>
              <span className="text-sm font-semibold">{user?.role}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
