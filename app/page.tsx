import Link from "next/link";
import { ArrowRight, Code2, Database, Layout } from "lucide-react";
import { Button } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Menu Management System
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Technical Test - Fullstack Developer Position
          </p>
          <div className="inline-block px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
            Next.js 16 + Go + GORM
          </div>
        </div>

        {/* Description */}
        <div className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            A hierarchical menu CRUD application with unlimited depth support,
            drag-and-drop reordering, and responsive design. Built to demonstrate
            fullstack development capabilities using modern technologies.
          </p>
        </div>

        {/* Tech Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-50 rounded-lg">
              <Layout className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
            <p className="text-sm text-gray-600">
              Next.js 16, TypeScript, Tailwind CSS v4, React DnD, Sonner
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-50 rounded-lg">
              <Database className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
            <p className="text-sm text-gray-600">
              Go (Golang), GORM, RESTful API, PostgreSQL
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-purple-50 rounded-lg">
              <Code2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Features</h3>
            <p className="text-sm text-gray-600">
              Drag & Drop, Unlimited Depth, Responsive UI, Toast Notifications
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/menus">
            <Button variant="primary" size="lg" className="min-w-[200px]">
              View Menu Manager
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-sm text-gray-500">
          Developed as a technical assessment for fullstack developer position
        </p>
      </div>
    </div>
  );
}
