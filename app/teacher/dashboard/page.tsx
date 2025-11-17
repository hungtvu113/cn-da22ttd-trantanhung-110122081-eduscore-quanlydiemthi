"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileEdit,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data
const statsData = {
  totalExams: 3,
  totalScoresEntered: 8,
  pendingScores: 4,
  averageScore: 7.5,
}

const assignedExams = [
  {
    id: "1",
    code: "EX2024001",
    name: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    date: "2024-01-25",
    totalStudents: 15,
    enteredScores: 15,
    status: "Hoàn thành",
  },
  {
    id: "3",
    code: "EX2024003",
    name: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    date: "2024-02-15",
    totalStudents: 12,
    enteredScores: 8,
    status: "Đang nhập",
  },
  {
    id: "5",
    code: "EX2024005",
    name: "Kỳ thi Tiếng Anh Nâng cao - Tháng 3/2024",
    date: "2024-03-10",
    totalStudents: 10,
    enteredScores: 0,
    status: "Chưa bắt đầu",
  },
]

const recentActivities = [
  {
    id: "1",
    action: "Nhập điểm",
    exam: "Kỳ thi Tiếng Anh Giao tiếp",
    count: 3,
    time: "2 giờ trước",
  },
  {
    id: "2",
    action: "Nhập điểm",
    exam: "Kỳ thi Tiếng Anh Giao tiếp",
    count: 5,
    time: "1 ngày trước",
  },
  {
    id: "3",
    action: "Hoàn thành",
    exam: "Kỳ thi Tiếng Anh Cơ bản",
    count: 15,
    time: "3 ngày trước",
  },
]

export default function TeacherDashboardPage() {
  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color,
  }: {
    icon: any
    title: string
    value: string | number
    subtitle: string
    color: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      "Hoàn thành": "bg-green-500/10 text-green-500 border-green-500/20",
      "Đang nhập": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Chưa bắt đầu": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }
    return styles[status as keyof typeof styles] || styles["Chưa bắt đầu"]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Hoàn thành":
        return <CheckCircle className="w-3 h-3" />
      case "Đang nhập":
        return <FileEdit className="w-3 h-3" />
      default:
        return <Clock className="w-3 h-3" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Giáo viên</h1>
              <p className="text-muted-foreground">
                Chào mừng trở lại, Nguyễn Thị Lan
              </p>
            </div>
          </div>
          <Link href="/teacher/scores">
            <Button className="gap-2 bg-blue-500 hover:bg-blue-600">
              <FileEdit className="w-4 h-4" />
              Nhập điểm ngay
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Kỳ thi được phân công"
          value={statsData.totalExams}
          subtitle="Tổng số kỳ thi"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={CheckCircle}
          title="Đã nhập điểm"
          value={statsData.totalScoresEntered}
          subtitle="Học viên"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={Clock}
          title="Chờ nhập điểm"
          value={statsData.pendingScores}
          subtitle="Học viên"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Điểm trung bình"
          value={statsData.averageScore.toFixed(1)}
          subtitle="Các kỳ thi đã chấm"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Assigned Exams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Kỳ thi được phân công
          </h3>
          <Link href="/teacher/scores">
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã kỳ thi</TableHead>
              <TableHead>Tên kỳ thi</TableHead>
              <TableHead>Ngày thi</TableHead>
              <TableHead>Tiến độ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignedExams.map((exam, index) => {
              const progress = exam.totalStudents > 0 
                ? (exam.enteredScores / exam.totalStudents) * 100 
                : 0
              return (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <TableCell className="font-mono font-medium">
                    {exam.code}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {exam.name}
                  </TableCell>
                  <TableCell>
                    {new Date(exam.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden max-w-[100px]">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {exam.enteredScores}/{exam.totalStudents}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        exam.status
                      )}`}
                    >
                      {getStatusIcon(exam.status)}
                      {exam.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/teacher/scores?exam=${exam.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FileEdit className="w-4 h-4 mr-2" />
                        Nhập điểm
                      </Button>
                    </Link>
                  </TableCell>
                </motion.tr>
              )
            })}
          </TableBody>
        </Table>
      </motion.div>

      {/* Recent Activities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card border rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" />
          Hoạt động gần đây
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileEdit className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">
                  {activity.action} {activity.count} học viên
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {activity.exam}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {activity.time}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

