"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle2,
  Clock
} from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Quản lý Người dùng",
    description: "Phân quyền rõ ràng cho Admin, Giám thị và Học viên với các chức năng riêng biệt.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Calendar,
    title: "Quản lý Kỳ thi",
    description: "Tạo, chỉnh sửa và theo dõi các kỳ thi một cách dễ dàng và hiệu quả.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: FileText,
    title: "Quản lý Học viên",
    description: "Quản lý thông tin học viên, tìm kiếm và theo dõi lịch sử thi của từng học viên.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: CheckCircle2,
    title: "Nhập điểm Nhanh chóng",
    description: "Nhập điểm thủ công hoặc import hàng loạt từ file Excel, tiết kiệm thời gian.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: BarChart3,
    title: "Thống kê & Báo cáo",
    description: "Xem biểu đồ, thống kê kết quả và xuất báo cáo Excel chuyên nghiệp.",
    color: "text-chart-5",
    bgColor: "bg-chart-5/10",
  },
  {
    icon: Shield,
    title: "Bảo mật Cao",
    description: "Mã hóa dữ liệu, xác thực JWT và phân quyền dựa trên vai trò (RBAC).",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    icon: Zap,
    title: "Hiệu suất Cao",
    description: "Xử lý nhanh chóng, giao diện mượt mà với công nghệ Next.js và MongoDB.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Clock,
    title: "Tiết kiệm Thời gian",
    description: "Giảm thiểu công việc thủ công, tra cứu điểm nhanh chóng, chính xác.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Tính năng nổi bật
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hệ thống quản lý kỳ thi với đầy đủ tính năng cần thiết
            cho việc quản lý điểm và thông tin học viên hiệu quả
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

