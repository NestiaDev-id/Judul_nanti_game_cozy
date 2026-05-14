extends Node

# ============================================================
# COZY GAME - UDP Bridge Receiver
# ============================================================
# Script ini berfungsi untuk menerima sinyal dari Tauri.
# Pastikan port (9001) sama dengan yang ada di Rust.
# ============================================================

var udp := PacketPeerUDP.new()
var port := 9001

func _ready():
	var err = udp.listen(port)
	if err == OK:
		print("📡 Godot: Mendengarkan di port ", port)
	else:
		print("❌ Godot: Gagal mendengarkan di port ", port)

func _process(_delta):
	if udp.get_available_packet_count() > 0:
		var packet = udp.get_packet().get_string_from_utf8()
		_handle_command(packet)

func _handle_command(msg: String):
	print("📩 Pesan diterima dari Tauri: ", msg)
	
	# Logika respon
	if msg == "START_COZY_WORLD":
		print("🚀 Memulai dunia Cozy...")
		# Di sini kamu bisa panggil fungsi generate world kamu
		# get_tree().change_scene_to_file("res://world.tscn")
