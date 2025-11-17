"use client"

import { motion } from "framer-motion"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"

const stats = [
  {
    title: "Tổng thí sinh",
    value: "1,234",
    icon: Users,
    trend: { value: 12.5, isPositive: true },
    color: "primary" as const,
  },
  {
    title: "Kỳ thi đang diễn ra",
    value: "8",
    icon: Calendar,
    trend: { value: 5.2, isPositive: true },
    color: "secondary" as const,
  },
  {
    title: "Bài thi đã chấm",
    value: "856",
    icon: FileText,
    trend: { value: 8.1, isPositive: true },
    color: "accent" as const,
  },
  {
    title: "Tỷ lệ đạt",
    value: "87.5%",
    icon: TrendingUp,
    trend: { value: 3.2, isPositive: true },
    color: "primary" as const,
  },
]

type ExamStatus = "completed" | "ongoing" | "upcoming"

const recentExams: Array<{
  id: number
  name: string
  date: string
  students: number
  status: ExamStatus
}> = [
  {
    id: 1,
    name: "Kỳ thi Tiếng Anh B1",
    date: "2025-10-20",
    students: 45,
    status: "completed",
  },
  {
    id: 2,
    name: "Kỳ thi Tin học văn phòng",
    date: "2025-10-22",
    students: 38,
    status: "ongoing",
  },
  {
    id: 3,
    name: "Kỳ thi Tiếng Anh A2",
    date: "2025-10-25",
    students: 52,
    status: "upcoming",
  },
  {
    id: 4,
    name: "Kỳ thi Excel nâng cao",
    date: "2025-10-28",
    students: 28,
    status: "upcoming",
  },
]

const statusConfig: Record<ExamStatus, {
  label: string
  variant: "success" | "default" | "secondary"
  icon: typeof CheckCircle2
}> = {
  completed: {
    label: "Hoàn thành",
    variant: "success" as const,
    icon: CheckCircle2,
  },
  ongoing: {
    label: "Đang diễn ra",
    variant: "default" as const,
    icon: Clock,
  },
  upcoming: {
    label: "Sắp diễn ra",
    variant: "secondary" as const,
    icon: AlertCircle,
  },
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại! Đây là tổng quan hệ thống của bạn.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatsCard
              key={stat.title}
              {...stat}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Recent Exams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Kỳ thi gần đây</CardTitle>
              <CardDescription>
                Danh sách các kỳ thi đã và sắp diễn ra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExams.map((exam, index) => {
                  const status = statusConfig[exam.status]
                  const StatusIcon = status.icon
                  
                  return (
                    <motion.div
                      key={exam.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{exam.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString("vi-VN")} • {exam.students} thí sinh
                          </p>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </motion.div>
                  )
                })}
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  Xem tất cả kỳ thi
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Tạo kỳ thi mới
              </CardTitle>
              <CardDescription>
                Thêm kỳ thi mới vào hệ thống
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-secondary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Quản lý thí sinh
              </CardTitle>
              <CardDescription>
                Xem và quản lý danh sách thí sinh
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 hover:border-accent/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Báo cáo & Thống kê
              </CardTitle>
              <CardDescription>
                Xem báo cáo chi tiết và thống kê
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

