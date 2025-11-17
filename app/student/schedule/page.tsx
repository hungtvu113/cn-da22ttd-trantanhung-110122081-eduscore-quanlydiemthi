"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Search, Clock, MapPin, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ExamSchedule = {
  id: string
  examCode: string
  examName: string
  subject: string
  date: string
  time: string
  duration: number
  room: string
  status: string
}

// Mock data
const scheduleData: ExamSchedule[] = [
  {
    id: "1",
    examCode: "EX2024005",
    examName: "Kỳ thi Tiếng Anh Nâng cao - Tháng 3/2024",
    subject: "Tiếng Anh Nâng cao",
    date: "2024-03-10",
    time: "08:00",
    duration: 120,
    room: "A101",
    status: "Sắp diễn ra",
  },
  {
    id: "2",
    examCode: "EX2024006",
    examName: "Kỳ thi Tin học Nâng cao - Tháng 3/2024",
    subject: "Tin học Nâng cao",
    date: "2024-03-15",
    time: "14:00",
    duration: 90,
    room: "B205",
    status: "Sắp diễn ra",
  },
  {
    id: "3",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    subject: "Tiếng Anh Giao tiếp",
    date: "2024-02-15",
    time: "08:00",
    duration: 120,
    room: "A102",
    status: "Đã thi",
  },
  {
    id: "4",
    examCode: "EX2024001",
    examName: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    subject: "Tiếng Anh Cơ bản",
    date: "2024-01-25",
    time: "08:00",
    duration: 120,
    room: "A101",
    status: "Đã thi",
  },
]

export default function StudentSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSchedule = scheduleData.filter(
    (exam) =>
      exam.examCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.examName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.room.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const styles = {
      "Sắp diễn ra": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Đang diễn ra": "bg-green-500/10 text-green-500 border-green-500/20",
      "Đã thi": "bg-gray-500/10 text-gray-500 border-gray-500/20",
    }
    return styles[status as keyof typeof styles] || styles["Đã thi"]
  }

  const upcomingExams = filteredSchedule.filter((e) => e.status === "Sắp diễn ra")
  const pastExams = filteredSchedule.filter((e) => e.status === "Đã thi")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Lịch thi</h1>
            <p className="text-muted-foreground">
              Xem lịch thi sắp tới và đã tham gia
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kỳ thi sắp tới</p>
              <p className="text-3xl font-bold">{upcomingExams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Đã tham gia</p>
              <p className="text-3xl font-bold">{pastExams.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative max-w-md"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo mã kỳ thi, tên, môn thi, phòng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </motion.div>

      {/* Upcoming Exams */}
      {upcomingExams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
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
                <TableHead>Thời gian</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingExams.map((exam, index) => (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell className="font-mono font-medium">
                    {exam.examCode}
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px] truncate">
                    {exam.examName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      {exam.subject}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(exam.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {exam.time}
                    </div>
                  </TableCell>
                  <TableCell>{exam.duration} phút</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {exam.room}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        exam.status
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Past Exams */}
      {pastExams.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-card border rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Đã tham gia
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã kỳ thi</TableHead>
                <TableHead>Tên kỳ thi</TableHead>
                <TableHead>Môn thi</TableHead>
                <TableHead>Ngày thi</TableHead>
                <TableHead>Giờ thi</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Phòng</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastExams.map((exam, index) => (
                <motion.tr
                  key={exam.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="group hover:bg-muted/50"
                >
                  <TableCell className="font-mono font-medium text-muted-foreground">
                    {exam.examCode}
                  </TableCell>
                  <TableCell className="font-medium max-w-[250px] truncate text-muted-foreground">
                    {exam.examName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {exam.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(exam.date).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {exam.time}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exam.duration} phút
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {exam.room}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                        exam.status
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredSchedule.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <Calendar className="w-16 h-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy lịch thi</h3>
          <p className="text-muted-foreground max-w-md">
            Không có lịch thi nào phù hợp với tìm kiếm của bạn
          </p>
        </motion.div>
      )}
    </div>
  )
}

