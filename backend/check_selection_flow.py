#!/usr/bin/env python3
"""
چک فلوی انتخاب واحد:
ادمین وارد می‌شود، ترم و درس و استاد و دانشجو ایجاد می‌کند،
دانشجو انتخاب واحد می‌کند، لیست موقت و نهایی چک می‌شود.
"""
import os
import sys
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from users.models import User
from courses.models import Course, Term, UnitLimit
from selection.models import CourseSelection


def log(msg):
    print(msg)


def main():
    client = APIClient()
    base = "/api"

    # اگر ادمین وجود نداشت، بساز (برای اجرای اسکریپت)
    admin_user = User.objects.filter(username="admin").first()
    if not admin_user:
        User.objects.create_superuser(username="admin", password="admin", email="admin@test.com")
        admin_user = User.objects.get(username="admin")
        admin_user.role = "admin"
        admin_user.save()
        log("کاربر admin با پسورد admin ایجاد شد.\n")

    def get_token(username, password):
        r = client.post(f"{base}/token/", {"username": username, "password": password}, format="json")
        if r.status_code != 200:
            body = getattr(r, "data", None) or (r.json() if hasattr(r, "json") and callable(getattr(r, "json")) else r.content)
            raise RuntimeError(f"Login failed: {r.status_code} {body}")
        return r.data["access"]

    log("=" * 60)
    log("۱. ورود به عنوان ادمین (admin / admin)")
    log("=" * 60)
    token_admin = get_token("admin", "admin")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_admin}")
    log("ورود ادمین موفق.\n")

    log("۲. ایجاد ترم و فعال کردن آن برای انتخاب واحد")
    log("-" * 40)
    start = timezone.now()
    end = start + timedelta(days=30)
    term_name = f"نیم‌سال تست {start.strftime('%Y%m%d-%H%M%S')}"
    r = client.post(
        f"{base}/terms/",
        {
            "name": term_name,
            "start_selection": start.isoformat(),
            "end_selection": end.isoformat(),
            "is_active": False,
        },
        format="json",
    )
    if r.status_code not in (200, 201):
        log(f"خطا در ایجاد ترم: {r.status_code} {r.data}")
        return
    term_id = r.data["id"]
    log(f"ترم ایجاد شد: id={term_id}, name={r.data['name']}")

    r = client.post(f"{base}/terms/{term_id}/toggle-active/")
    if r.status_code != 200:
        log(f"خطا در فعال‌سازی ترم: {r.status_code} {r.data}")
        return
    log(f"ترم فعال شد: is_active={r.data['is_active']}\n")

    log("۳. ثبت چند استاد و اختصاص به درس‌ها")
    log("-" * 40)
    UnitLimit.objects.get_or_create(defaults={"min_units": 12, "max_units": 20})

    suffix = timezone.now().strftime("%H%M%S")
    for i, (num, name) in enumerate([(f"p{suffix}1", "احمدی"), (f"p{suffix}2", "رضایی")], 1):
        r = client.post(
            f"{base}/users/register/register-professor/",
            {
                "personnel_number": num,
                "national_code": f"111111111{i}",
                "first_name": "استاد",
                "last_name": name,
            },
            format="json",
        )
        if r.status_code not in (200, 201):
            log(f"خطا در ثبت استاد {num}: {r.status_code} {r.data}")
        else:
            log(f"استاد ثبت شد: {num} / استاد {name}")

    r = client.get(f"{base}/users/professors/")
    professors = r.data if isinstance(r.data, list) else (r.data.get("results") or [])
    prof_numbers = [p["number"] for p in professors]
    if len(prof_numbers) < 2:
        log("نیاز به حداقل ۲ استاد. از قبل وجود دارند یا الان اضافه شدند.")
    prof1, prof2 = prof_numbers[0], prof_numbers[1] if len(prof_numbers) > 1 else prof_numbers[0]

    courses_data = [
        (f"CS101_{suffix}", "برنامه‌نویسی ۱", prof1),
        (f"CS102_{suffix}", "برنامه‌نویسی ۲", prof1),
        (f"MATH101_{suffix}", "ریاضی ۱", prof2),
        (f"ENG101_{suffix}", "زبان انگلیسی", prof2),  # جمعاً ۱۲ واحد برای نهایی کردن
    ]
    course_codes = [c[0] for c in courses_data]
    for code, name, prof_number in courses_data:
        r = client.post(
            f"{base}/courses/",
            {
                "code": code,
                "name": name,
                "capacity": 30,
                "units": 3,
                "day": "شنبه",
                "term": term_id,
                "professor_personnel_number": prof_number,
            },
            format="json",
        )
        if r.status_code not in (200, 201):
            log(f"خطا در ایجاد درس {code}: {r.status_code} {r.data}")
        else:
            log(f"درس ایجاد شد: {code} - {name} (استاد شماره={prof_number})")
    log("")

    log("۴. ثبت یک دانشجو")
    log("-" * 40)
    student_username = f"stu{suffix}"
    r = client.post(
        f"{base}/users/register/register-student/",
        {
            "student_number": student_username,
            "national_code": "1234567890",
            "first_name": "علی",
            "last_name": "محمدی",
        },
        format="json",
    )
    if r.status_code not in (200, 201):
        log(f"خطا در ثبت دانشجو: {r.status_code} {r.data}")
        return
    log(f"دانشجو ثبت شد: {student_username} / علی محمدی\n")

    log("۵. ورود به عنوان دانشجو و انتخاب واحد")
    log("-" * 40)
    client.credentials()
    token_student = get_token(student_username, "1234567890")
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_student}")

    for code in course_codes:
        r = client.post(
            f"{base}/selection/selections/select-course/",
            {"course_code": code},
            format="json",
        )
        if r.status_code in (200, 201):
            log(f"انتخاب درس {code} موفق.")
        else:
            log(f"انتخاب درس {code}: {r.status_code} {r.data}")
    log("")

    log("۶. لیست دروس موقت (قبل از نهایی کردن) - چک نتیجه")
    log("-" * 40)
    r = client.get(f"{base}/selection/selections/draft/")
    if r.status_code != 200:
        log(f"خطا: {r.status_code} {r.data}")
    else:
        data = r.data
        log("وضعیت: موفق (۲۰۰)")
        log(f"تعداد واحد کل: {data.get('total_units')}")
        log("لیست دروس موقت:")
        for c in data.get("courses", []):
            log(f"  - {c.get('course_code')} | {c.get('course_name')} | {c.get('units')} واحد")
    log("")

    log("۷. نهایی کردن انتخاب واحد")
    log("-" * 40)
    r = client.post(f"{base}/selection/selections/finalize/")
    if r.status_code != 200:
        log(f"نتیجه نهایی کردن: {r.status_code} {r.data}")
    else:
        log("وضعیت: موفق (۲۰۰)")
        log(f"پیام: {r.data.get('detail')}")
        log(f"تعداد واحد نهایی: {r.data.get('total_units')}")
    log("")

    log("۸. چک مجدد لیست موقت (باید خالی باشد بعد از نهایی)")
    log("-" * 40)
    r = client.get(f"{base}/selection/selections/draft/")
    if r.status_code != 200:
        log(f"خطا: {r.status_code} {r.data}")
    else:
        data = r.data
        courses = data.get("courses", [])
        log(f"تعداد دروس در سبد موقت: {len(courses)}")
        log(f"مجموع واحد: {data.get('total_units')}")
        if not courses:
            log("انتظار: سبد موقت بعد از نهایی خالی است. درست است.")
        else:
            log("لیست:")
            for c in courses:
                log(f"  - {c.get('course_code')} | {c.get('course_name')}")
    log("")
    log("=" * 60)
    log("پایان چک فلوی انتخاب واحد.")
    log("=" * 60)


if __name__ == "__main__":
    main()
