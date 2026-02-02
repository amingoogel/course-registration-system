"""
تست تمام اندپوینت‌های API پروژه
"""
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from users.models import User
from courses.models import Course, Term, Prerequisite, UnitLimit
from selection.models import CourseSelection


def get_jwt_token(client, username, password):
    """دریافت توکن JWT با لاگین"""
    r = client.post('/api/token/', {'username': username, 'password': password}, format='json')
    if r.status_code == 200:
        return r.data.get('access')
    return None


class AllEndpointsTest(TestCase):
    """تست همه اندپوینت‌ها"""

    def setUp(self):
        self.client = APIClient()
        # ادمین
        self.admin = User.objects.create_superuser(
            username='admin', password='admin123', email='admin@test.com'
        )
        self.admin.role = 'admin'
        self.admin.save()
        # استاد
        self.professor = User.objects.create_user(
            username='prof1', password='prof123', role='professor',
            first_name='استاد', last_name='تست'
        )
        # دانشجو
        self.student = User.objects.create_user(
            username='stu1', password='stu123', role='student',
            first_name='دانشجو', last_name='تست'
        )
        # ترم و درس (با timezone برای جلوگیری از naive datetime warning)
        start = timezone.now()
        end = start + timedelta(days=30)
        self.term = Term.objects.create(
            name='نیمسال اول ۱۴۰۴',
            start_selection=start,
            end_selection=end,
            is_active=True
        )
        self.course1 = Course.objects.create(
            code='CS101',
            name='برنامه‌نویسی ۱',
            professor=self.professor,
            capacity=30,
            units=3,
            term=self.term
        )
        self.course2 = Course.objects.create(
            code='CS102',
            name='برنامه‌نویسی ۲',
            professor=self.professor,
            capacity=30,
            units=3,
            term=self.term
        )
        UnitLimit.objects.get_or_create(defaults={'min_units': 12, 'max_units': 20})

    def _auth_admin(self):
        token = get_jwt_token(self.client, 'admin', 'admin123')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _auth_professor(self):
        token = get_jwt_token(self.client, 'prof1', 'prof123')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _auth_student(self):
        token = get_jwt_token(self.client, 'stu1', 'stu123')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

    def _clear_auth(self):
        self.client.credentials()

    # --- احراز هویت ---
    def test_token_obtain(self):
        r = self.client.post('/api/token/', {'username': 'admin', 'password': 'admin123'}, format='json')
        self.assertEqual(r.status_code, 200, msg=f'token obtain: {r.data}')
        self.assertIn('access', r.data)

    def test_token_refresh(self):
        r = self.client.post('/api/token/', {'username': 'admin', 'password': 'admin123'}, format='json')
        refresh = r.data.get('refresh')
        r2 = self.client.post('/api/token/refresh/', {'refresh': refresh}, format='json')
        self.assertEqual(r2.status_code, 200)

    # --- کاربر جاری ---
    def test_current_user(self):
        self._auth_admin()
        r = self.client.get('/api/users/me/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data.get('username'), 'admin')

    # --- درس‌ها (با کد) ---
    def test_courses_list(self):
        self._auth_admin()
        r = self.client.get('/api/courses/')
        self.assertEqual(r.status_code, 200)
        data = r.data.get('results') if isinstance(r.data, dict) else r.data
        self.assertIsInstance(data, list)

    def test_courses_retrieve_by_code(self):
        self._auth_admin()
        r = self.client.get(f'/api/courses/{self.course1.code}/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data.get('code'), 'CS101')

    def test_courses_create_admin(self):
        self._auth_admin()
        r = self.client.post('/api/courses/', {
            'code': 'MATH101',
            'name': 'ریاضی ۱',
            'capacity': 30,
            'units': 3,
            'term': self.term.id,
            'professor_personnel_number': 'prof1',
        }, format='json')
        self.assertIn(r.status_code, (200, 201), msg=f'create course: {r.data}')

    def test_courses_delete_by_code(self):
        self._auth_admin()
        c = Course.objects.create(code='DEL101', name='حذفی', capacity=30, units=3, term=self.term)
        r = self.client.delete(f'/api/courses/{c.code}/')
        self.assertIn(r.status_code, (200, 204))

    # --- پیش‌نیاز (کد درس) ---
    def test_prerequisites_list(self):
        self._auth_admin()
        r = self.client.get('/api/prerequisites/')
        self.assertEqual(r.status_code, 200)

    def test_prerequisites_create_with_codes(self):
        self._auth_admin()
        r = self.client.post('/api/prerequisites/', {
            'course_code': 'CS102',
            'prerequisite_code': 'CS101',
        }, format='json')
        self.assertIn(r.status_code, (200, 201), msg=f'prereq create: {r.data}')

    # --- ترم‌ها ---
    def test_terms_list(self):
        self._auth_admin()
        r = self.client.get('/api/terms/')
        self.assertEqual(r.status_code, 200)

    def test_terms_create(self):
        self._auth_admin()
        start = timezone.now()
        end = start + timedelta(days=30)
        r = self.client.post('/api/terms/', {
            'name': 'نیمسال دوم ۱۴۰۴',
            'start_selection': start.isoformat(),
            'end_selection': end.isoformat(),
            'is_active': False,
        }, format='json')
        self.assertIn(r.status_code, (200, 201))

    def test_terms_toggle_active(self):
        self._auth_admin()
        r = self.client.post(f'/api/terms/{self.term.id}/toggle-active/')
        self.assertEqual(r.status_code, 200)
        self.assertIn('is_active', r.data)

    # --- حد واحد ---
    def test_unit_limit_get(self):
        self._auth_admin()
        r = self.client.get('/api/unit-limit/')
        self.assertEqual(r.status_code, 200)

    # --- دروس دارای پیش‌نیاز (فقط کد) ---
    def test_courses_with_prerequisites(self):
        self._auth_admin()
        r = self.client.get('/api/courses-with-prerequisites/')
        self.assertEqual(r.status_code, 200)
        self.assertIsInstance(r.data, list)

    # --- اساتید (courses: id/full_name) ---
    def test_professors_list(self):
        self._auth_admin()
        r = self.client.get('/api/professors/')
        self.assertEqual(r.status_code, 200)

    # --- لیست دانشجویان برای ادمین (شماره، اسم، فامیل) ---
    def test_students_list_admin(self):
        self._auth_admin()
        r = self.client.get('/api/users/students/')
        self.assertEqual(r.status_code, 200)
        data = r.data.get('results') if isinstance(r.data, dict) else r.data
        self.assertIsInstance(data, list)
        if data:
            self.assertIn('number', data[0])
            self.assertIn('first_name', data[0])
            self.assertIn('last_name', data[0])

    # --- لیست اساتید برای ادمین (شماره پرسنلی، اسم، فامیل) ---
    def test_professors_list_admin(self):
        self._auth_admin()
        r = self.client.get('/api/users/professors/')
        self.assertEqual(r.status_code, 200)
        data = r.data.get('results') if isinstance(r.data, dict) else r.data
        self.assertIsInstance(data, list)
        if data:
            self.assertIn('number', data[0])
            self.assertIn('first_name', data[0])
            self.assertIn('last_name', data[0])

    # --- ثبت‌نام کاربر (ادمین) ---
    def test_register_student(self):
        self._auth_admin()
        r = self.client.post('/api/users/register/register-student/', {
            'student_number': '9921001',
            'national_code': '1234567890',
            'first_name': 'علی',
            'last_name': 'محمدی',
        }, format='json')
        self.assertIn(r.status_code, (200, 201), msg=f'register student: {r.data}')

    def test_register_professor(self):
        self._auth_admin()
        r = self.client.post('/api/users/register/register-professor/', {
            'personnel_number': '2001',
            'national_code': '9876543210',
            'first_name': 'رضا',
            'last_name': 'احمدی',
        }, format='json')
        self.assertIn(r.status_code, (200, 201), msg=f'register professor: {r.data}')

    # --- تاریخچه ورود ---
    def test_login_history_list(self):
        self._auth_admin()
        r = self.client.get('/api/users/login-history/')
        self.assertEqual(r.status_code, 200)
        data = r.data.get('results') if isinstance(r.data, dict) else r.data
        self.assertIsInstance(data, list)

    # --- انتخاب واحد (دانشجو) ---
    def test_selections_list_student(self):
        self._auth_student()
        r = self.client.get('/api/selection/selections/')
        self.assertEqual(r.status_code, 200)

    def test_select_course_by_code(self):
        self._auth_student()
        r = self.client.post('/api/selection/selections/select-course/', {'course_code': 'CS101'}, format='json')
        self.assertIn(r.status_code, (200, 201, 400), msg=f'select course: {r.data}')
        if r.status_code == 201:
            self.assertIn('course', str(r.data) or '')

    def test_draft_selections(self):
        self._auth_student()
        r = self.client.get('/api/selection/selections/draft/')
        self.assertEqual(r.status_code, 200)
        self.assertIn('courses', r.data)
        self.assertIn('total_units', r.data)

    def test_delete_selection_by_code(self):
        self._auth_student()
        CourseSelection.objects.get_or_create(student=self.student, course=self.course1, defaults={})
        r = self.client.delete('/api/selection/selections/delete-selection/?course_code=CS101')
        self.assertIn(r.status_code, (200, 204, 400))

    def test_schedule(self):
        self._auth_student()
        r = self.client.get('/api/selection/selections/schedule/')
        self.assertIn(r.status_code, (200, 403))

    def test_finalize(self):
        self._auth_student()
        r = self.client.post('/api/selection/selections/finalize/')
        self.assertIn(r.status_code, (200, 400, 403))

    def test_report_card(self):
        self._auth_student()
        r = self.client.get(f'/api/selection/selections/report-card/?term_id={self.term.id}')
        self.assertIn(r.status_code, (200, 400))

    # --- استاد: لیست دانشجویان با کد درس ---
    def test_professor_students_by_course_code(self):
        self._auth_professor()
        r = self.client.get(f'/api/selection/professor/CS101/students/')
        self.assertIn(r.status_code, (200, 404))

    def test_professor_remove_student_by_code_and_number(self):
        self._auth_professor()
        r = self.client.delete(
            f'/api/selection/professor/CS101/remove-student/?student_number=stu1'
        )
        self.assertIn(r.status_code, (200, 204, 400, 404))

    # --- بدون احراز هویت ---
    def test_courses_list_unauth_fails(self):
        self._clear_auth()
        r = self.client.get('/api/courses/')
        self.assertEqual(r.status_code, 401)

    def test_courses_with_prerequisites_unauth_fails(self):
        self._clear_auth()
        r = self.client.get('/api/courses-with-prerequisites/')
        self.assertEqual(r.status_code, 401)
