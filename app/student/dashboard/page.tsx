"use client"

import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  TrendingUp,
  Award,
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
  totalExams: 2,
  averageScore: 8.25,
  highestScore: 9.0,
  lowestScore: 7.5,
}

const myScores = [
  {
    id: "1",
    examCode: "EX2024001",
    examName: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    subject: "Tiếng Anh Cơ bản",
    date: "2024-01-25",
    score: 8.0,
    grade: "Giỏi",
    status: "Đã có điểm",
  },
  {
    id: "2",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    subject: "Tiếng Anh Giao tiếp",
    date: "2024-02-15",
    score: 8.5,
    grade: "Giỏi",
    status: "Đã có điểm",
  },
]

const upcomingExams = [
  {
    id: "1",
    examCode: "EX2024005",
    examName: "Kỳ thi Tiếng Anh Nâng cao - Tháng 3/2024",
    subject: "Tiếng Anh Nâng cao",
    date: "2024-03-10",
    time: "08:00 - 10:00",
    room: "A101",
    status: "Sắp diễn ra",
  },
]

export default function StudentDashboardPage() {
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

  const getGradeColor = (grade: string) => {
    const colors: Record<string, string> = {
      "Xuất sắc": "text-purple-500",
      "Giỏi": "text-blue-500",
      "Khá": "text-green-500",
      "Trung bình": "text-yellow-500",
      "Yếu": "text-orange-500",
      "Kém": "text-red-500",
    }
    return colors[grade] || "text-gray-500"
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
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Học viên</h1>
              <p className="text-muted-foreground">
                Chào mừng trở lại, Nguyễn Văn An
              </p>
            </div>
          </div>
          <Link href="/student/scores">
            <Button className="gap-2 bg-green-500 hover:bg-green-600">
              <FileText className="w-4 h-4" />
              Xem điểm
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Calendar}
          title="Kỳ thi đã tham gia"
          value={statsData.totalExams}
          subtitle="Tổng số kỳ thi"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Điểm trung bình"
          value={statsData.averageScore.toFixed(2)}
          subtitle="Tất cả các kỳ thi"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Award}
          title="Điểm cao nhất"
          value={statsData.highestScore.toFixed(1)}
          subtitle="Thành tích tốt nhất"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={FileText}
          title="Điểm thấp nhất"
          value={statsData.lowestScore.toFixed(1)}
          subtitle="Cần cải thiện"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-card border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            Kỳ thi sắp tới
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã kỳ thi</TableHead>
                <TableHead>Tên kỳ thi</TableHead>
                <TableHead>Môn thi</TableHead>
                <TableHead>Ngày thi</TableHead>
                <TableHead>Giờ thi</TableHead>
                <TableHead>Phòng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingExams.map((exam, index) => (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="group"
                >
                  <TableCell className="font-mono font-medium">
                    {exam.examCode}
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {exam.examName}
                  </TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>
                    {new Date(exam.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                      {exam.room}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* My Scores */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-card border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Điểm của tôi
          </h3>
          <Link href="/student/scores">
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
              <TableHead>Môn thi</TableHead>
              <TableHead>Ngày thi</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Xếp loại</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myScores.map((score, index) => (
              <motion.tr
                key={score.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="group"
              >
                <TableCell className="font-mono font-medium">
                  {score.examCode}
                </TableCell>
                <TableCell className="font-medium max-w-[300px] truncate">
                  {score.examName}
                </TableCell>
                <TableCell>{score.subject}</TableCell>
                <TableCell>
                  {new Date(score.date).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell>
                  <span className="text-lg font-bold text-green-500">
                    {score.score.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${getGradeColor(score.grade)}`}>
                    {score.grade}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                    <CheckCircle className="w-3 h-3" />
                    {score.status}
                  </span>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  )
}

