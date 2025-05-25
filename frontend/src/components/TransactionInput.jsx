import { useState, useRef } from 'react'
import { createWorker } from 'tesseract.js'
import { toast } from 'react-hot-toast'
import {
  MicrophoneIcon,
  CameraIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'

export default function TransactionInput({ onSave, onCancel }) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transactionData, setTransactionData] = useState(null)
  const [editedData, setEditedData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
  })
  
  const recognitionRef = useRef(null)
  const fileInputRef = useRef(null)

  // Initialize Web Speech API
  const initializeSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        parseVoiceInput(transcript)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        toast.error('Failed to recognize speech')
        setIsRecording(false)
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
      }
    } else {
      toast.error('Speech recognition is not supported in your browser')
    }
  }

  // Parse voice input using natural language processing
  const parseVoiceInput = (transcript) => {
    const text = transcript.toLowerCase()
    const amountMatch = text.match(/\d+/)
    const isIncome = text.includes('income') || text.includes('earned') || text.includes('received')
    
    // Simple category detection
    const categories = ['food', 'transport', 'shopping', 'utilities', 'entertainment', 'salary']
    const foundCategory = categories.find(cat => text.includes(cat)) || 'other'

    setTransactionData({
      type: isIncome ? 'income' : 'expense',
      amount: amountMatch ? parseFloat(amountMatch[0]) : 0,
      category: foundCategory,
      description: transcript,
    })

    setEditedData({
      type: isIncome ? 'income' : 'expense',
      amount: amountMatch ? amountMatch[0] : '',
      category: foundCategory,
      description: transcript,
    })
  }

  // Handle voice recording
  const handleVoiceRecord = async () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition()
    }

    if (isRecording) {
      recognitionRef.current?.stop()
    } else {
      try {
        setIsRecording(true)
        await recognitionRef.current?.start()
      } catch (error) {
        console.error('Speech recognition error:', error)
        toast.error('Failed to start recording')
        setIsRecording(false)
      }
    }
  }

  // Handle image upload and OCR
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    try {
      const worker = await createWorker()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      
      const { data: { text } } = await worker.recognize(file)
      await worker.terminate()

      // Parse OCR text
      const amountMatch = text.match(/(?:KES|KSH|RS)\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/i) ||
                         text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)/i)
      
      const amount = amountMatch ? 
        parseFloat(amountMatch[1].replace(/,/g, '')) : 0

      // First line as description
      const description = text.split('\n')[0]

      setTransactionData({
        type: 'expense',
        amount,
        category: 'other',
        description: description || 'Receipt scan',
        rawText: text,
      })

      setEditedData({
        type: 'expense',
        amount: amount.toString(),
        category: 'other',
        description: description || 'Receipt scan',
      })

    } catch (error) {
      console.error('OCR error:', error)
      toast.error('Failed to process image')
    } finally {
      setIsProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSave = () => {
    if (!editedData.amount || !editedData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    onSave({
      ...editedData,
      amount: parseFloat(editedData.amount),
      timestamp: new Date().toISOString(),
    })
  }

  return (
    <div className="space-y-6">
      {/* Input Methods */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={handleVoiceRecord}
          disabled={isProcessing}
          className={`card flex items-center justify-center py-8 hover:bg-gray-50 ${
            isRecording ? 'bg-red-50 ring-2 ring-red-500' : ''
          }`}
        >
          <MicrophoneIcon 
            className={`h-8 w-8 ${isRecording ? 'text-red-600' : 'text-gray-600'}`} 
          />
          <span className="ml-3 text-lg font-medium">
            {isRecording ? 'Recording...' : 'Speak Expense'}
          </span>
        </button>

        <label className={`card flex items-center justify-center py-8 cursor-pointer hover:bg-gray-50 ${
          isProcessing ? 'bg-gray-50' : ''
        }`}>
          <CameraIcon className="h-8 w-8 text-gray-600" />
          <span className="ml-3 text-lg font-medium">
            {isProcessing ? 'Processing...' : 'Snap Receipt'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleImageUpload}
            disabled={isProcessing}
          />
        </label>
      </div>

      {/* Transaction Edit Form */}
      {transactionData && (
        <div className="card border border-primary-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Review Transaction</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={editedData.type}
                onChange={(e) => setEditedData({ ...editedData, type: e.target.value })}
                className="input-field mt-1"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
              <input
                type="number"
                value={editedData.amount}
                onChange={(e) => setEditedData({ ...editedData, amount: e.target.value })}
                className="input-field mt-1"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={editedData.category}
                onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                className="input-field mt-1"
              >
                <option value="">Select category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="utilities">Utilities</option>
                <option value="entertainment">Entertainment</option>
                <option value="salary">Salary</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={editedData.description}
                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                className="input-field mt-1"
                placeholder="Enter description"
              />
            </div>

            {transactionData.rawText && (
              <div>
                <label className="block text-sm font-medium text-gray-700">OCR Result</label>
                <pre className="mt-1 p-2 bg-gray-50 rounded-lg text-sm text-gray-600 max-h-32 overflow-auto">
                  {transactionData.rawText}
                </pre>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={onCancel}
                className="btn-secondary flex items-center"
              >
                <XMarkIcon className="h-5 w-5 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn-primary flex items-center"
              >
                <CheckIcon className="h-5 w-5 mr-1" />
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 