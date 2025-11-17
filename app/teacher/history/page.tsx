"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { History, Search, Calendar, Award } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ScoreHistory = {
  id: string
  examCode: string
  examName: string
  studentCode: string
  studentName: string
  score: number
  notes: string
  enteredDate: string
}

// Mock data
const mockExams = [
  { id: "all", name: "Tất cả kỳ thi" },
  { id: "1", name: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024" },
  { id: "3", name: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024" },
]

const historyData: ScoreHistory[] = [
  {
    id: "1",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    studentCode: "123456789",
    studentName: "Nguyễn Văn An",
    score: 8.5,
    notes: "Làm bài tốt",
    enteredDate: "2024-02-16 14:30",
  },
  {
    id: "2",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    studentCode: "987654321",
    studentName: "Trần Thị Bình",
    score: 9.0,
    notes: "Xuất sắc",
    enteredDate: "2024-02-16 14:35",
  },
  {
    id: "3",
    examCode: "EX2024003",
    examName: "Kỳ thi Tiếng Anh Giao tiếp - Tháng 2/2024",
    studentCode: "777888999",
    studentName: "Võ Minh Đức",
    score: 7.5,
    notes: "",
    enteredDate: "2024-02-16 14:40",
  },
  {
    id: "4",
    examCode: "EX2024001",
    examName: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    studentCode: "123456789",
    studentName: "Nguyễn Văn An",
    score: 8.0,
    notes: "Khá tốt",
    enteredDate: "2024-01-26 10:15",
  },
  {
    id: "5",
    examCode: "EX2024001",
    examName: "Kỳ thi Tiếng Anh Cơ bản - Tháng 1/2024",
    studentCode: "987654321",
    studentName: "Trần Thị Bình",
    score: 9.0,
    notes: "Xuất sắc",
    enteredDate: "2024-01-26 10:20",
  },
]

export default function TeacherHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExam, setSelectedExam] = useState("all")

  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.examCode.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesExam = selectedExam === "all" || item.examCode.includes(selectedExam)

    return matchesSearch && matchesExam
  })

  const getGrade = (score: number) => {
    if (score >= 9.0) return { label: "Xuất sắc", color: "text-purple-500" }
    if (score >= 8.0) return { label: "Giỏi", color: "text-blue-500" }
    if (score >= 7.0) return { label: "Khá", color: "text-green-500" }
    if (score >= 5.5) return { label: "Trung bình", color: "text-yellow-500" }
    if (score >= 4.0) return { label: "Yếu", color: "text-orange-500" }
    return { label: "Kém", color: "text-red-500" }
  }

  const totalScores = filteredHistory.length
  const averageScore =
    totalScores > 0
      ? filteredHistory.reduce((sum, item) => sum + item.score, 0) / totalScores
      : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Lịch sử nhập điểm</h1>
            <p className="text-muted-foreground">
              Xem lại các điểm đã nhập trước đó
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
              <History className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số điểm đã nhập</p>
              <p className="text-3xl font-bold">{totalScores}</p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              <p className="text-3xl font-bold">{averageScore.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo mã SV, tên, mã kỳ thi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2 min-w-[250px]">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger>
              <SelectValue placeholder="Lọc theo kỳ thi" />
            </SelectTrigger>
            <SelectContent>
              {mockExams.map((exam) => (
                <SelectItem key={exam.id} value={exam.id}>
                  {exam.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="border rounded-lg bg-card"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Mã kỳ thi</TableHead>
              <TableHead>Tên kỳ thi</TableHead>
              <TableHead>Mã SV</TableHead>
              <TableHead>Họ và tên</TableHead>
              <TableHead>Điểm</TableHead>
              <TableHead>Xếp loại</TableHead>
              <TableHead>Ghi chú</TableHead>
              <TableHead>Ngày nhập</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => {
                const grade = getGrade(item.score)
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {item.examCode}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {item.examName}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {item.studentCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.studentName}
                    </TableCell>
                    <TableCell>
                      <span className="text-lg font-bold text-blue-500">
                        {item.score.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${grade.color}`}>
                        {grade.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                      {item.notes || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.enteredDate}
                    </TableCell>
                  </motion.tr>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <History className="w-12 h-12 text-muted-foreground/20" />
                    <p className="text-muted-foreground">
                      Không tìm thấy lịch sử nhập điểm
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  )
}

