"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Mail, Lock, ArrowRight, UserCog, Users, User } from "lucide-react"
import Link from "next/link"

// Mock users database
const MOCK_USERS = [
  {
    email: "admin@st.tvu.edu.vn",
    password: "admin123",
    role: "admin",
    name: "Quản trị viên",
    redirectTo: "/admin/dashboard",
  },
  {
    email: "nguyenthilan@st.tvu.edu.vn",
    password: "teacher123",
    role: "teacher",
    name: "Nguyễn Thị Lan",
    redirectTo: "/teacher/dashboard",
  },
  {
    email: "123456789@st.tvu.edu.vn",
    password: "student123",
    role: "student",
    name: "Nguyễn Văn An",
    redirectTo: "/student/dashboard",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      )

      if (user) {
        // Store user info in localStorage (mock authentication)
        localStorage.setItem("user", JSON.stringify(user))
        // Redirect to appropriate dashboard
        router.push(user.redirectTo)
      } else {
        setError("Email hoặc mật khẩu không đúng!")
        setIsLoading(false)
      }
    }, 500)
  }

  const handleQuickLogin = (user: typeof MOCK_USERS[0]) => {
    setIsLoading(true)
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify(user))
      router.push(user.redirectTo)
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Animated background */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-bold">Đăng nhập</CardTitle>
              <CardDescription className="text-base mt-2">
                Chào mừng trở lại với QuizHub
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email">Email TVU</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="123456789@st.tvu.edu.vn"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Sinh viên: mã SV (9 số) | Giáo viên/Admin: tên tài khoản
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full group"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </form>

            {/* Quick Login for Testing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-3"
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Hoặc đăng nhập nhanh (Demo)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(MOCK_USERS[0])}
                  disabled={isLoading}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <UserCog className="w-5 h-5 text-primary" />
                  <span className="text-xs font-medium">Admin</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(MOCK_USERS[1])}
                  disabled={isLoading}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium">Giáo viên</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin(MOCK_USERS[2])}
                  disabled={isLoading}
                  className="flex flex-col h-auto py-3 gap-1"
                >
                  <User className="w-5 h-5 text-green-500" />
                  <span className="text-xs font-medium">Học viên</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center text-sm bg-muted/50 p-4 rounded-lg space-y-2"
            >
              <p className="font-semibold text-foreground">Tài khoản Demo:</p>
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground">
                  <span className="font-medium">Admin:</span> admin@st.tvu.edu.vn / admin123
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Giáo viên:</span> nguyenthilan@st.tvu.edu.vn / teacher123
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium">Học viên:</span> 123456789@st.tvu.edu.vn / student123
                </p>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Quay lại trang chủ
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

