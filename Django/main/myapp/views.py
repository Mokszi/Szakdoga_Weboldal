from collections import defaultdict
from datetime import datetime
from django.shortcuts import render, redirect
from .models import munkakör
from .models import beadás
from .models import ember
from .models import felosztás
from django.http import JsonResponse
import json
import hashlib
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

#WEBPAGES
def index(request):
    return render(request, "index.html")

def user(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('nev')
        try:
            hand_in_record = beadás.objects.latest('beadási_határidő')
            beadási_határidő = hand_in_record.beadási_határidő
            return render(request, 'user.html', {'név': név, 'beadási_határidő': beadási_határidő})
        except beadás.DoesNotExist:
            return render(request, 'user.html', {'error': 'No hand-in record found for this user'})
    else:
        return redirect('/index.html')

def user_services(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('nev')
        brutto_sum = request.COOKIES.get('brutto_sum')
        try:
            user = ember.objects.get(név=név)
            beosztás_id = user.beosztás_id

            # Retrieve the total money for the user's position
            munkakor_instance = munkakör.objects.get(id=beosztás_id)
            pénz = munkakor_instance.pénz

            # Retrieve the number of people with the same position as the user
            user_position_count = ember.objects.filter(beosztás_id=beosztás_id).count()

            # Calculate the amount of money per user based on the user's position
            if user_position_count > 0:
                pénz_per_user = int(pénz / user_position_count)
            else:
                pénz_per_user = 0
            # Handle the case where brutto_sum is None (not included in POST request)
            if brutto_sum is None:
                brutto_sum = 0
            else:
                # Convert brutto_sum to an integer
                brutto_sum = int(brutto_sum)

            # Calculate the difference between pénz_per_user and brutto_sum
            difference = pénz_per_user - brutto_sum

            return render(request, 'user_services.html', {'név': név, 'pénz_per_user': pénz_per_user, 'difference': difference})
        except ember.DoesNotExist:
            return render(request, 'user_services.html', {'error': 'User not found'})
        except munkakör.DoesNotExist:
            return render(request, 'user_services.html', {'error': 'Position not found'})
    else:
        return redirect('/index.html')

def user_about(request):
    return render(request, "user_about.html")

def admin(request):
    total_employees = ember.objects.count()
    present_employees = ember.objects.exclude(beadási_határidő=None).count()
    return render(request, 'admin.html', {'total_employees': total_employees, 'present_employees': present_employees})

def admin_employees(request):
    sign_ins = ember.objects.all()  # Fetch all sign_ins
    munkakör_ids = sign_ins.values_list('beosztás_id', flat=True)  # Get all munkakör IDs from ember objects
    positions = munkakör.objects.filter(id__in=munkakör_ids)  # Fetch corresponding munkakör objects
    return render(request, "admin_employees.html", {'sign_ins': sign_ins, 'positions': positions})

def admin_calendar(request):
    return render(request, "admin_calendar.html")

def admin_calendar_emp_tit(request):
    return render(request, "admin_calendar_emp_tit.html")

def admin_positions(request):
    positions = munkakör.objects.all().order_by('-pénz')
    sign_ins = ember.objects.all()

    # Count based on beosztás_id
    title_counts = defaultdict(int)
    for user in sign_ins:
        title_counts[user.beosztás_id] += 1  

    # Ensure title_counts has default values for all munkakör IDs
    for position in positions:
        title_counts.setdefault(position.id, 0)

    return render(request, 'admin_positions.html', {'positions': positions, 'title_counts': dict(title_counts)})

#PENCIL
def update_position(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            current_title = data.get('current_title')  # Added line
            current_money = data.get('current_money')  # Added line
            beosztás = data.get('beosztás')
            pénz = data.get('pénz')

            try:
                # Check if the munkakör exists with the current beosztás and pénz
                position_obj = munkakör.objects.get(beosztás=current_title, pénz=current_money)
            except munkakör.DoesNotExist:
                print("munkakör does not exist")
                return JsonResponse({'success': False, 'error': 'munkakör does not exist'})

            # Update the munkakör with the new beosztás and pénz
            position_obj.beosztás = beosztás
            position_obj.pénz = pénz
            position_obj.save()

            return JsonResponse({'success': True})
        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})

#PLUS POSITIONS
def add_item_to_database(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            new_item = munkakör.objects.create(beosztás=data['beosztás'], pénz=data['pénz'])
            return JsonResponse({'success': True, 'id': new_item.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
#PLUS EMPLOYEES
def add_user_to_database(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            new_item = ember.objects.create(név=data['név'], admin_e=data['admin_e'])
            return JsonResponse({'success': True, 'id': new_item.id})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'})
    
#TRASHCAN POSITIONS
def delete_position(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            beosztás = data.get('beosztás')
            position_to_delete = munkakör.objects.get(beosztás=beosztás)
            position_to_delete.delete()
            return JsonResponse({'success': True})
        except munkakör.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'munkakör does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)
    
#TRASHCAN EMPLOYEES
def delete_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            név = data.get('név')
            user_to_delete = ember.objects.get(név=név)
            user_to_delete.delete()
            return JsonResponse({'success': True})
        except ember.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=405)

#FINALIZE DATE
@csrf_exempt
def save_finalized_date(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            finalized_date_str = str(data.get('finalized_date'))
            finalized_date = datetime.strptime(finalized_date_str, '%Y-%m-%d')
            beadás.objects.all().update(beadási_határidő=finalized_date)
            return JsonResponse({'success': True})
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Invalid date format'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

#FINALIZE DATE EMP_TIT
@csrf_exempt
def save_finalized_date_emp_tit(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            finalized_date_str = str(data.get('finalized_date'))
            finalized_date = datetime.strptime(finalized_date_str, '%Y-%m-%d')
            beadás.objects.all().update(felvételi_határidő=finalized_date)
            return JsonResponse({'success': True})
        except ValueError:
            return JsonResponse({'success': False, 'error': 'Invalid date format'})
    return JsonResponse({'success': False, 'error': 'Invalid request method'})

#REGISTER
@csrf_exempt
def register(request):
    if request.method == 'POST':
        név = request.POST.get('név')
        id = request.POST.get('id')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        # Check if new passwords are provided and match
        if password1 is None or password2 is None:
            error_message = "Kérlek mind kétszer add meg a jelszavadat!."
            return render(request, 'index.html', {'error_message': error_message})
        elif password1 != password2:
            error_message = "A jelszavak nem eggyeznek."
            return render(request, 'index.html', {'error_message': error_message})

        # Hash the new jelszó
        hashed_password = hashlib.sha256(password1.encode()).hexdigest()

        # Check if the user exists
        try:
            user = ember.objects.get(id=id, név=név)
        except ember.DoesNotExist:
            error_message = "A felhasználó nem létezik."
            return render(request, 'index.html', {'error_message': error_message})

        # Update the jelszó
        user.jelszó = hashed_password
        user.save()

        # Redirect to a success page or render a success message
        return redirect('/index.html')
    else:
        return render(request, 'index.html')

#LOGIN
def login(request):
    if request.method == 'POST':
        név = request.POST.get('név')
        jelszó = request.POST.get('jelszó')
        # Hash the entered jelszó
        entered_hashed_password = hashlib.sha256(jelszó.encode()).hexdigest()
        try:
            user = ember.objects.get(név=név)
            stored_hashed_password = user.jelszó
            admin_e = user.admin_e
            # Check if the entered jelszó matches the stored hashed jelszó or its normal version
            if entered_hashed_password == stored_hashed_password or jelszó == stored_hashed_password:
                if admin_e:
                    response = redirect('/admin.html')
                else:
                    response = redirect('/user.html')
                response.set_cookie('logged_in', 'true')
                response.set_cookie('nev', név)
                return response
            else:
                error_message = "Hibás név vagy jelszó. Kérlek próbáld újra."
                return render(request, 'index.html', {'error_message': error_message})
        except ember.DoesNotExist:
            error_message = "Hibás név vagy jelszó. Kérlek próbáld újra."
            return render(request, 'index.html', {'error_message': error_message})
    else:
        return render(request, 'index.html')

#név PRINT HOME AND HAND IN TIME
def user_page(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('nev')
        try:
            hand_in_record = beadás.objects.latest('beadási_határidő')
            beadási_határidő = hand_in_record.beadási_határidő
            return render(request, 'user.html', {'név': név, 'beadási_határidő': beadási_határidő})
        except beadás.DoesNotExist:
            return render(request, 'user.html', {'error': 'Nem található beadási idő ehhez a fiókhoz.'})
    else:
        return redirect('/index.html')
    
#név PRINT SERVICES
def services_page(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('név') 
        return render(request, 'user_services.html', {'név': név})
    else:
        return redirect('index.html')

#beosztás LIST EMPLOYEES
def get_positions(request):
    positions = munkakör.objects.values('beosztás')
    titles = [pos['beosztás'] for pos in positions]
    return JsonResponse(titles, safe=False)

#UPDATE beosztás EMPLOYEES 
def update_user_title(request):
    # Parse JSON data from the request body
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError as e:
        print('Error decoding JSON:', e)
        return JsonResponse({'success': False, 'error': 'Invalid JSON data'})

    # Extract név, new_title, and admin_e from parsed JSON data
    név = data.get('név')
    new_title = data.get('new_title')
    admin_e = data.get('admin_e')

    if név is not None and (new_title is not None or admin_e is not None):
        try:
            user = ember.objects.get(név=név)
            
            if new_title is not None:
                try:
                    munkakör_obj = munkakör.objects.get(beosztás=new_title)
                    user.beosztás_id = munkakör_obj.id
                except munkakör.DoesNotExist:
                    print('Munkakör not found')  # Debugging statement
                    return JsonResponse({'success': False, 'error': 'Munkakör not found'})
            
            if admin_e is not None:
                user.admin_e = admin_e
            user.save()
            return JsonResponse({'success': True})
        except ember.DoesNotExist:
            print('User not found')  # Debugging statement
            return JsonResponse({'success': False, 'error': 'User not found'})
    else:
        print('Invalid request')  # Debugging statement
        return JsonResponse({'success': False, 'error': 'Missing név or new_title or admin_e'})

#USER beosztás AND pénz PRINT SERVICES
def user_title(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('név')
        print("név:", név)  # Debugging print
        
        beosztás_id = request.COOKIES.get('beosztás_id')
        print("beosztás_id:", beosztás_id)  # Debugging print

        try:
            position = munkakör.objects.get(beosztás_id=beosztás_id)
            pénz = position.pénz
            print("pénz:", pénz)  # Debugging print

            return render(request, 'user_services.html', {'név': név, 'pénz': pénz})
        except munkakör.DoesNotExist as e:
            print("Error:", e)  # Debugging print
            return render(request, 'user_services.html', {'error': 'Munkakör not found'})
    else:
        return redirect('/index.html')

#SAVE SERVICES
def save_services(request):
    if request.method == 'POST':
        név = request.COOKIES.get('nev')        
        if név:
            logged_in_person = ember.objects.get(név=név)
            data = json.loads(request.body)
            # Process the data as needed
            for key, value in data.items():
                if key in ['egeszseg', 'nyugdij', 'berkent', 'szep', 'ajandek', 'berlet', 'kultur', 'sport', 'ovi']:
                    type_ = key  # Use the key directly as the type
                    for month, month_data in value.items():
                        összeg = month_data.get('összeg', 0)
                        if összeg == 0:
                            # If összeg is 0, delete the existing row if it exists
                            existing_row = felosztás.objects.filter(személy=logged_in_person.id, típus=type_, hónap=month).first()
                            if existing_row:
                                existing_row.delete()
                        else:
                            # If összeg is not 0, update or create the row
                            existing_row = felosztás.objects.filter(személy=logged_in_person.id, típus=type_, hónap=month).first()
                            if existing_row:
                                # Update összeg if row exists
                                existing_row.összeg = összeg
                                existing_row.save()
                            else:
                                # Create a new row if row does not exist
                                felosztás.objects.create(típus=type_, hónap=month, összeg=összeg, személy=logged_in_person.id)
                else:
                    # Process other keys as before
                    corrected_key = key.replace('é', 'e').replace('á', 'a').replace('ö', 'o').replace('ű', 'u').replace('ő', 'o').replace('ü', 'u').replace('ó', 'o').replace('í', 'i')
                    if isinstance(value, dict):
                        for month, month_data in value.items():
                            összeg = month_data.get('összeg', 0) 
                            if összeg == 0:
                                # If összeg is 0, delete the existing row if it exists
                                existing_row = felosztás.objects.filter(személy=logged_in_person.id, típus=type_, hónap=month).first()
                                if existing_row:
                                    existing_row.delete()
                            else:
                                if 'összeg' in month_data and összeg != 0:
                                    # Split the corrected key to extract type and month
                                    key_parts = corrected_key.split('_')
                                    if len(key_parts) == 2:  # Ensure there are exactly two parts after splitting
                                        type_, month = key_parts
                                        # Check if a row already exists with the same személy, típus, and hónap
                                        existing_row = felosztás.objects.filter(személy=logged_in_person.id, típus=type_, hónap=month).first()
                                        if existing_row:
                                            # Update összeg if row exists
                                            existing_row.összeg = összeg
                                            existing_row.save()
                                        else:
                                            # Create a new row if row does not exist
                                            felosztás.objects.create(típus=type_, hónap=month, összeg=összeg, személy=logged_in_person.id) 
                                    else:
                                        print("Error: Invalid key format:", corrected_key)
                                else:
                                    print("Error: Value is not a dictionary or összeg is 0:", value)      
            return JsonResponse({'status': 'success', 'message': 'Data saved to felosztás'})
        else:
            print("Error: név not provided in cookie")
            return JsonResponse({'status': 'error', 'message': 'név not provided in cookie'})
    else:
        print("Error: Invalid request method")
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

#PRINT INPUT FIELD SERVICES
def fetch_saved_services(request):
    if request.method == 'GET':
        név = request.COOKIES.get('nev')  # Retrieve name from cookies
        if név:
            try:
                logged_in_person = ember.objects.get(név=név)

                # Initialize data dictionary with default values
                data = {'status': 'success', 'data': {
                    'berkent_jan': 0, 'berkent_feb': 0, 'berkent_mar': 0,
                    'berkent_apr': 0, 'berkent_maj': 0, 'berkent_jun': 0,
                    'berkent_jul': 0, 'berkent_aug': 0, 'berkent_sep': 0,
                    'berkent_okt': 0, 'berkent_nov': 0, 'berkent_dec': 0,
                    'nyugdij_jan': 0, 'nyugdij_feb': 0, 'nyugdij_mar': 0,
                    'nyugdij_apr': 0, 'nyugdij_maj': 0, 'nyugdij_jun': 0,
                    'nyugdij_jul': 0, 'nyugdij_aug': 0, 'nyugdij_sep': 0,
                    'nyugdij_okt': 0, 'nyugdij_nov': 0, 'nyugdij_dec': 0,
                    'egeszseg_jan': 0, 'egeszseg_feb': 0, 'egeszseg_mar': 0,
                    'egeszseg_apr': 0, 'egeszseg_maj': 0, 'egeszseg_jun': 0,
                    'egeszseg_jul': 0, 'egeszseg_aug': 0, 'egeszseg_sep': 0,
                    'egeszseg_okt': 0, 'egeszseg_nov': 0, 'egeszseg_dec': 0,
                    'szep_I': 0, 'szep_II': 0, 'szep_III': 0, 'szep_IV': 0,
                    'ajandek_I': 0, 'berlet_I': 0, 'kultur_I': 0, 'sport_I': 0,
                    'ovi_I': 0
                }}
                
                # Fetch data from 'felosztás' table
                felosztás_data = felosztás.objects.filter(személy=logged_in_person.id)
                
                # Iterate through 'felosztás' data and update input fields if data available
                for entry in felosztás_data:
                    if entry.típus == 'szep':
                        if entry.hónap == 'Mar':
                            data['data']['szep_I'] = entry.összeg
                        elif entry.hónap == 'Jun':
                            data['data']['szep_II'] = entry.összeg
                        elif entry.hónap == 'Sze':
                            data['data']['szep_III'] = entry.összeg
                        elif entry.hónap == 'Dec':
                            data['data']['szep_IV'] = entry.összeg
                    elif entry.típus == 'ajandek':
                        if entry.hónap == 'Jan':
                            data['data']['ajandek_I'] = entry.összeg
                    elif entry.típus in ['berlet', 'kultur', 'sport', 'ovi']:
                        if entry.hónap == 'Dec':
                            field_name = f"{entry.típus.lower()}_I"
                            data['data'][field_name] = entry.összeg
                    else:
                        field_name = f"{entry.típus.lower()}_{entry.hónap.lower()}"
                        data['data'][field_name] = entry.összeg

                return JsonResponse(data)
            except ember.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'No user found for this name'})
            except felosztás.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'No distribution data found for this user'})
        else:
            return JsonResponse({'status': 'error', 'message': 'név not provided'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

#FINALIZE BUTTON
@csrf_exempt
def finalize(request):
    if request.COOKIES.get('logged_in') == 'true':
        név = request.COOKIES.get('név')
        try:
            user = ember.objects.get(név=név)
            user.beadási_határidő = timezone.now()  # Set beadási_határidő to current time
            user.save()
            return JsonResponse({'success': True})
        except ember.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'User not found'})

#beadási_határidő ember
def check_hand_in_time(request):
    if request.method == 'GET':
        név = request.GET.get('név', None)
        if név:
            try:
                user = ember.objects.get(név=név)
                beadási_határidő = user.beadási_határidő
                if beadási_határidő:
                    # If beadási_határidő is present, return JSON response indicating it
                    return JsonResponse({'beadási_határidő': True})
                else:
                    # If beadási_határidő is not present, return JSON response indicating it
                    return JsonResponse({'beadási_határidő': False})
            except ember.DoesNotExist:
                # If user does not exist, return error response
                return JsonResponse({'error': 'User not found'}, status=404)
        else:
            # If név is not provided, return error response
            return JsonResponse({'error': 'név is required'}, status=400)
    else:
        # If request method is not GET, return error response
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
#CHECK beadási_határidő FINALIZE BUTTON
def check_hand_in_time_finalize(request):
    if request.method == 'GET':
        try:
            user = ember.objects.get(név=request.COOKIES.get('név'))
            beadási_határidő = user.beadási_határidő
            return JsonResponse({'beadási_határidő': beadási_határidő})
        except ember.DoesNotExist:
            return JsonResponse({'error': 'User not found'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

#CHECK felvételi_határidő EMP_TIT
def check_modify_time_emp_tit(request):
    if request.method == 'GET':
        try:
            hand_in_instance = beadás.objects.get(id=1)
            felvételi_határidő = hand_in_instance.felvételi_határidő if hand_in_instance else None
            if felvételi_határidő:
                return JsonResponse({'felvételi_határidő': felvételi_határidő})
            else:
                return JsonResponse({'error': 'No modify time found'})
        except beadás.DoesNotExist:
            return JsonResponse({'error': 'beadás instance not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

#LOGOUT
def logout(request):
    response = redirect('/index.html')  # Redirect to the homepage or any other desired page
    response.set_cookie('nev', '')  # Set the 'nev' cookie to an empty value
    return response
