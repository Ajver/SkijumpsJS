extends Sprite

func load_sprite(texture_path:String) -> void:
	var tex = ImageTexture.new()
	tex.load(texture_path)
	texture = tex