from django.db import models

class munkakör(models.Model):
    id = models.IntegerField(primary_key=True)
    beosztás = models.CharField(max_length=45)
    pénz = models.IntegerField()

    class Meta:
        db_table = 'munkakör'
        managed = True

class beadás(models.Model):
    id = models.IntegerField(primary_key=True)
    beadási_határidő = models.DateTimeField()
    felvételi_határidő = models.DateTimeField()

    class Meta:
        db_table = 'beadás'
        managed = True

class ember(models.Model):
    id = models.IntegerField(primary_key=True)
    név = models.CharField(max_length=45)
    jelszó = models.CharField(max_length=100)
    beosztás_id = models.IntegerField()
    beadási_határidő = models.DateTimeField()
    admin_e = models.BooleanField(default=False)

    class Meta:
        db_table = 'ember'
        managed = True

    def check_password(self, jelszó):
        return self.jelszó == jelszó

class felosztás(models.Model):
    id = models.IntegerField(primary_key=True)
    személy = models.CharField(max_length=45)
    típus = models.CharField(max_length=45)
    hónap = models.CharField(max_length=45)
    összeg = models.IntegerField()

    class Meta:
        db_table = 'felosztás'
        managed = True