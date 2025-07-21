import { Component, OnInit, Input } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { FormsModule } from '@angular/forms'; // لأجل [(ngModel)]
import { CommonModule } from '@angular/common'; // لأجل *ngFor, *ngIf
import { HttpClientModule } from '@angular/common/http'; // تأكدي من استيرادها هنا لو المكون standalone

@Component({
  selector: 'app-chatbot',
  standalone: true, // تأكدي إن المكون standalone لو بتستخدمي Angular 15+
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule // لو المكون standalone لازم تضيفيه هنا
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {
  @Input() isChatOpen: boolean = false; // هذا المتغير للتحكم في ظهور نافذة الشات
  messages: { text: string, isUser: boolean }[] = [];
  userInput: string = '';
  chatbotResponses: any; // هنا سنخزن بيانات الـ JSON
  currentLanguage: string = 'ar'; // اللغة الافتراضية، تقدري تخليها 'en'

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    this.loadChatbotData();
  }

  loadChatbotData(): void {
    this.chatbotService.getChatbotResponses().subscribe(
      data => {
        this.chatbotResponses = data;
        // رسالة ترحيب أول ما البوت يشتغل
        this.addBotMessage(this.getRandomResponse('greetings', this.currentLanguage));
      },
      error => {
        console.error('Error loading chatbot data:', error);
        this.addBotMessage('آسف، حدث خطأ في تحميل البيانات. برجاء المحاولة لاحقاً.');
      }
    );
  }

  sendMessage(): void {
    if (this.userInput.trim() === '') {
      return; // لو الرسالة فاضية متعملش حاجة
    }

    const userMessageText = this.userInput;
    this.messages.push({ text: userMessageText, isUser: true });
    const processedUserMessage = userMessageText.toLowerCase();

    let botResponse = 'أنا آسف، لم أفهم سؤالك. هل يمكنك إعادة صياغة السؤال؟'; // رد افتراضي لو ملقيناش تطابق
    let foundIntent = false; // متغير للتحقق إذا وجدنا نية متطابقة

    // نمر على جميع النوايا في بيانات الشات بوت
    for (const intentKey in this.chatbotResponses) {
      if (this.chatbotResponses.hasOwnProperty(intentKey)) {
        const intentData = this.chatbotResponses[intentKey]?.[this.currentLanguage]; // بيانات النية للغة الحالية

        if (intentData && intentData.questions && Array.isArray(intentData.questions)) {
          // نتحقق إذا كانت أي من الأسئلة المحتملة (keywords) موجودة في رسالة المستخدم
          const matchedQuestion = intentData.questions.some((q: string) => processedUserMessage.includes(q.toLowerCase()));
          if (matchedQuestion) {
            botResponse = this.getRandomResponse(intentKey, this.currentLanguage);
            foundIntent = true;
            break; // لقينا رد، نخرج من اللوب
          }
        }
      }
    }

    // ممكن نضيف تأخير بسيط عشان يبان إن البوت بيفكر
    setTimeout(() => {
      this.addBotMessage(botResponse);
    }, 500);

    this.userInput = ''; // تفريغ مربع الإدخال
  }

  addBotMessage(text: string): void {
    this.messages.push({ text: text, isUser: false });
  }

  getRandomResponse(intentKey: string, lang: string): string {
    if (this.chatbotResponses && this.chatbotResponses[intentKey]) {
      const langData = this.chatbotResponses[intentKey][lang];

      if (langData && typeof langData === 'object' && langData !== null && 'responses' in langData) {
        const responsesArray = langData['responses'];
        // نتأكد أن مصفوفة الردود ليست فارغة
        if (responsesArray && responsesArray.length > 0) {
            return responsesArray[Math.floor(Math.random() * responsesArray.length)];
        }
      }
    }
    return 'آسف، لا أستطيع الرد الآن.'; // رد احتياطي لو فيه مشكلة
  }

  // وظيفة لتبديل اللغة (تقدري تربطيها بزرار في الواجهة)
  toggleLanguage(): void {
    this.currentLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.messages = []; // مسح المحادثة القديمة عند تغيير اللغة
    this.addBotMessage(this.getRandomResponse('greetings', this.currentLanguage)); // رسالة ترحيب باللغة الجديدة
  }

  // وظيفة لفتح/إغلاق نافذة الشات بوت
  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen; // بتعكس حالة الظهور
  }
}