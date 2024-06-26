from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("index.html", views.index, name="index"),
    path("user.html", views.user, name="user"),
    path("user_services.html", views.user_services, name="user_services"),
    path("user_about.html", views.user_about, name="user_about"),
    path("admin.html", views.admin, name="admin"),
    path("admin_employees.html", views.admin_employees, name="admin_employees"),
    path("admin_calendar.html", views.admin_calendar, name="admin_calendar"),
    path("admin_calendar_emp_tit.html", views.admin_calendar_emp_tit, name="admin_calendar_emp_tit"),
    path("admin_positions.html", views.admin_positions, name="admin_positions"),
    path('update_position/', views.update_position, name='update_position'),
    path('add_item_to_database/', views.add_item_to_database, name='add_item_to_database'),
    path('add_user_to_database/', views.add_user_to_database, name='add_user_to_database'),
    path('delete_position/', views.delete_position, name='delete_position'),
    path('save_finalized_date/', views.save_finalized_date, name='save_finalized_date'),
    path('save_finalized_date_emp_tit/', views.save_finalized_date_emp_tit, name='save_finalized_date_emp_tit'),
    path("register/", views.register, name="register"),
    path("login/", views.login, name="login"),
    path("user/", views.user_page, name="user_page"),
    path('delete_user/', views.delete_user, name='delete_user'),
    path('get_positions/', views.get_positions, name='get_positions'),
    path('update_user_title/', views.update_user_title, name='update_user_title'),
    path("user_services/", views.services_page, name="services_page"),
    path("user_services/", views.user_title, name="user_title"),
    path("save_services/", views.save_services, name="save_services"),
    path("fetch_saved_services/", views.fetch_saved_services, name="fetch_saved_services"),
    path("finalize/", views.finalize, name="finalize"),
    path("check_hand_in_time/", views.check_hand_in_time, name="check_hand_in_time"),
    path("check_hand_in_time_finalize/", views.check_hand_in_time_finalize, name="check_hand_in_time_finalize"),
    path("check_modify_time_emp_tit/", views.check_modify_time_emp_tit, name="check_modify_time_emp_tit"),
    path("logout/", views.logout, name="logout"),
]