import { useState, useCallback, useRef, useEffect } from 'react'
import { Camera, Upload, History, AlertCircle, CheckCircle, XCircle, ArrowRight, RefreshCw, Link2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api, type ScanResult, type ScanHistoryItem, type TrashItem } from '@/lib/api'
import CategoryBadge from '@/components/CategoryBadge'
import { cn } from '@/lib/utils'

export default function ScanPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [recognizing, setRecognizing] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [history, setHistory] = useState<ScanHistoryItem[]>([])
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan')

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getScanHistory()
      setHistory(Array.isArray(data) ? data : (data as any).data ?? [])
    } catch {}
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    setSelectedFile(file)
    setScanResult(null)
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const handleRecognize = useCallback(async () => {
    if (!selectedFile) return
    setRecognizing(true)
    try {
      const result = await api.scanRecognize(selectedFile.name)
      setScanResult(result)
      loadHistory()
    } catch {
    } finally {
      setRecognizing(false)
    }
  }, [selectedFile, loadHistory])

  const handleReset = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setScanResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex gap-2 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
        <button
          onClick={() => setActiveTab('scan')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
            activeTab === 'scan'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <Camera size={16} />
          拍照识别
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-all',
            activeTab === 'history'
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          )}
        >
          <History size={16} />
          识别历史
        </button>
      </div>

      {activeTab === 'scan' && (
        <div className="space-y-6">
          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={cn(
                'cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all',
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Upload size={32} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                拖拽图片到这里，或点击选择
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持 JPG、PNG 等格式，文件名含关键词可触发识别
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['bottle', 'paper', 'battery', 'food'].map((kw) => (
                  <span key={kw} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                    示例: {kw}.jpg
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                {previewUrl && (
                  <img src={previewUrl} alt="预览" className="mx-auto max-h-80 w-auto object-contain" />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-3">
                  <p className="text-sm text-white">{selectedFile.name}</p>
                </div>
              </div>

              {!scanResult && (
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    重新选择
                  </button>
                  <button
                    onClick={handleRecognize}
                    disabled={recognizing}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {recognizing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        识别中...
                      </>
                    ) : (
                      <>
                        <Camera size={18} />
                        开始识别
                      </>
                    )}
                  </button>
                </div>
              )}

              {scanResult && (
                <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                  {scanResult.recognized && scanResult.result ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                          <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">识别成功</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">置信度：{scanResult.result.confidence}%</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{scanResult.result.name}</h4>
                          <CategoryBadge category={scanResult.result.category as any} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{scanResult.result.subCategory}</span> · {scanResult.result.disposalMethod}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">注意事项：</span>{scanResult.result.precautions}
                        </p>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000"
                          style={{ width: `${scanResult.result.confidence}%` }}
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleReset}
                          className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                          继续识别
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                          <AlertCircle size={24} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">未识别到该物品</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">建议提交到社区，让大家一起完善</p>
                        </div>
                      </div>

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                        <p className="text-sm text-amber-800 dark:text-amber-300">
                          <XCircle size={16} className="inline mr-1" />
                          系统未能识别此物品，您可以将其提交到社区，帮助我们完善数据库。
                        </p>
                      </div>

                      <button
                        onClick={() => navigate('/community')}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 font-medium text-white hover:bg-amber-600 transition-colors"
                      >
                        <Link2 size={18} />
                        提交到社区
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 dark:bg-gray-800">
              <History size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">暂无识别历史</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="flex items-center gap-3">
                  {item.result ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                      <XCircle size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.imageFileName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.result ? (
                        <>
                          {item.result.itemName} · {item.result.categoryName} · {item.result.confidence}%
                        </>
                      ) : (
                        '未识别'
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(item.timestamp).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
