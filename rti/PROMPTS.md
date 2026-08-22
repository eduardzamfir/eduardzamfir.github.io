# Prompts used in the RTI paper and project page

Every prompt behind a figure, gallery or video, with the file it comes from.

## Project page — every visual

Source: `paper/modscale/webpage/prompts_page.txt`

> Index NN maps to the assets named pNN. Prompts with no role listed were generated during selection and are kept for provenance.

0. [p00 · seed 2 · explorer · §02 trajectory · §02b · §02c] A polished white marble statue of a young woman with intricately carved curls and deeply folded drapery, displayed in a museum under warm directional light against a dark background, fine chisel marks visible in the stone.
1. [p01 · seed 2 · explorer · §02 trajectory] A screenshot from a photorealistic third-person fantasy game rendered in Unreal Engine 5: a close shot of a knight in ornately engraved plate armour braced behind a battered shield, driving a longsword into a towering horned beast with matted fur and glowing eyes, rain and sparks flying, ruined stone courtyard, ultra detailed.
2. [p02 · seed 2 · explorer] The Mona Lisa rendered as a Minecraft scene, blocky voxel textures.
3. [p03 · seed 2 · §06 low-budget panes] Golden-hour street photograph of a rain-soaked crosswalk in Tokyo, umbrellas and neon reflections, shot on Portra 400 with a 35mm Summicron, shallow depth of field.
4. [p04 · seed 2] A peacock displaying its tail on a lawn, every eyespot and barb rendered, iridescent teal and gold, overcast light, telephoto compression.
5. [p05 · seed 2 · §06 low-budget panes] The nave of a Gothic cathedral at midday, light from a rose window scattering coloured lozenges across the stone floor, ribbed vaults receding into shadow, wide-angle architectural photograph.
6. [p06 · seed 2 · explorer] Black swallowtail butterfly perched gracefully on a vibrant yellow flower, its wings displaying intricate patterns of black, white, and blue against a blurred backdrop of green foliage and additional blooms.
7. [p07 · seed 2 · §06b style unstated] A small friendly robot in a bright research lab holding a white sign that says exactly HELLO in bold black letters. No other readable text.
8. [p08 · seed 3 · explorer] A lone red fox standing in deep snow at dawn, individual guard hairs and whiskers sharp, breath visible, flat white field and pale sky behind, wildlife photograph with a long lens.
9. [p09 · seed 4 · explorer · §06 low-budget panes] Reflection in an astronaut's gold visor: the surface of Mars with a rocket lifting off in the middle distance, exhaust plume and a rolling dust cloud, the astronaut's own gloved hand raised, ultra detailed, black sky.
10. [p10 · seed 4] A black steam locomotive hauling through a snowy mountain pass, rivets, pipework and frost on the boiler in sharp focus, steam plume rising against pale peaks and a flat overcast sky, documentary photograph.
11. [p11 · seed 4 · explorer · §02 trajectory] A blue-and-white porcelain vase on a seamless studio backdrop, every painted brushstroke and crackle in the glaze visible, soft single-source light, plain grey background.
12. [p12 · seed 4 · explorer · §02b] A waterfall beside the ruins of a medieval stone arch deep in an old-growth forest, moss and ivy over the weathered masonry, mist rising from the plunge pool, overcast light, realistic photograph.
13. [p13 · seed 4 · explorer · §02 trajectory · §02c] A chameleon gripping a thin branch, individual scales and the curl of its tail in focus, shallow depth of field, dense jungle background.
14. [p14 · seed 4] Close-up portrait of a woman in a mustard beret under falling snow, luminous porcelain-smooth skin with soft bright highlights, snowflakes caught on wool fibres and eyelashes, cool daylight, cinematic Kodachrome look.
15. [p15 · seed 2 · explorer · §02 trajectory · §02b] A floating archipelago of islands chained above a sea of cloud, waterfalls pouring off their undersides into the void, lantern-lit spires clinging to the rock, painted fantasy illustration.
16. [p16 · seed 2 · §06b photograph stated] A photorealistic studio photograph of a small friendly robot in a bright research lab holding a white sign that says exactly HELLO in bold black letters, brushed metal and plastic shell, 50mm lens, shallow depth of field, photographic lighting, not an illustration.
17. [p17 · seed 2 · §06b cartoon stated] A flat two-dimensional cartoon illustration of a small friendly robot in a bright research lab holding a white sign that says exactly HELLO in bold black letters, bold black outlines, flat colour fill, vector art style, no photographic shading.

## Paper Fig. 1 — teaser

Source: `evaluation/span_fig1_insets.py`

> Columns (b) sailboat and (c) hot-air balloon used --prompt overrides that were not recorded in the repository.

0. a red cube on top of a blue sphere on a wooden table

## Paper Fig. 5 — RTI against feature-similarity merging

Source: `results/gallery_fig5 (symlinks into gallery_cmp3 / cmp7 / cmp9)`

0. The Mona Lisa rendered as a Minecraft scene, blocky voxel textures.
1. A red STOP sign on a snowy street corner.
2. A snow leopard walking across a rocky mountain ridge at dawn.
3. A screenshot from a photorealistic third-person fantasy game rendered in Unreal Engine 5: a close shot of a knight in ornately engraved plate armour lunging with a longsword at a huge scaled drake, its individual scales and bared fangs catching the light, claws raised, embers and dust in the air, ruined cathedral interior, volumetric god rays, ultra detailed.
4. A polished white marble statue of a young woman with intricately carved curls and deeply folded drapery, displayed in a museum under warm directional light against a dark background, fine chisel marks visible in the stone.

## Paper Fig. 8 — the partition along the trajectory

Source: `evaluation/span_traj_grid.py`

0. a red fox curled up asleep in autumn leaves
1. a lighthouse on a rocky cliff under a dramatic sky
2. a majestic lion portrait with a golden mane
3. a hot air balloon drifting over green hills
4. a hummingbird hovering beside a bright red flower
5. a sailboat on a calm lake at sunset
6. a red panda resting on a tree branch
7. a snowy owl in flight over a winter field
8. a vintage red car on a coastal road at sunset
9. a bowl of ramen with a soft egg, steam rising
10. a colorful parrot perched on a jungle branch
11. a corgi puppy sitting in a sunny meadow

## Paper — ordering ablation samples

Source: `results/gallery_orders_v2, prompt indices 11, 6, 7, 9`

0. Close-up portrait of a woman in a mustard beret under falling snow, snowflakes caught on wool fibers and eyelashes, cinematic Kodachrome look.
1. Macro photograph of a honeybee landing on a lavender stalk, wings frozen mid-beat, pollen dust visible, creamy bokeh background.
2. An elderly fisherman mending a turquoise net on a stone pier at dawn, weathered hands in focus, oil painting with thick impasto strokes.
3. A ballet dancer mid-leap backstage, caught in a slice of window light, dust motes in the air, black and white 35mm film grain.

## Paper — matched-cost figure

Source: `PartiPrompts, random.seed(12), sample of 12, index 07, seed 11`

0. a giraffe with a funny face

## Paper — grouping mechanism figure

Source: `calibration/prompts_1k.json, indices 3 and 11`

0. a cup of matcha on a marble counter, soft window light
1. a peacock wading through shallow water in a snowy clearing

## Paper appendix — budget galleries and failure cases

Source: `results/gallery_supp/prompts.txt`

0. A black and white architectural photograph of a modern spiral staircase, viewed from below. The image is a study in lines, curves, and repeating patterns, with strong geometric shapes and a full range of tones from pure white to deep black.
1. A detailed line drawing of a compass rose, intricately designed with geometric patterns and ornate borders, reminiscent of vintage cartography, rendered in black-and-white.
2. Black swallowtail butterfly perched gracefully on a vibrant yellow flower, its wings displaying intricate patterns of black, white, and blue against a blurred backdrop of green foliage and additional blooms.
3. Detailed, close-up photograph of a person's face, artistically covered in a vibrant and expressive layer of multi-colored paint. The camera is focused sharply on the subject's left eye, creating a shallow depth of field that softly blurs the rest of the face and the background. The paint is applied in thick, bold strokes and dabs, creating a vivid rainbow portrait.
4. A majestic lion's head rendered in a geometric illustration style. The mane is an explosion of sharp, angular polygons and triangles in shades of gold and brown. The face is a symmetrical composition of circles and clean lines, creating a powerful and abstract portrait.
5. A sushi map of the United States, featuring rolls with colorful toppings that correspond to different regions, sits on a polished wooden table adorned with cherry blossom petals, a small bonsai tree, and a traditional Japanese lantern casting warm, ambient light over the scene.
6. Cute chibi character dressed in a vibrant red kimono adorned with golden floral patterns stands gracefully against a warm, circular backdrop, holding a long bamboo stick with a delicate orange flower.
7. A small friendly robot in a bright research lab holding a white sign that says exactly MiniT2I in bold black letters. No other readable text.
8. An antique pocket watch opened to reveal its brass gears and springs, macro photograph.
9. A luminous metropolis floats serenely beneath the translucent domes of colossal jellyfish, their bioluminescent bellies glowing with the warmth of an inverted urban skyline, drifting through the tranquil depths of an otherworldly ocean.
10. A screenshot from a photorealistic third-person fantasy game rendered in Unreal Engine 5: a close shot of a knight in ornately engraved plate armour braced behind a battered shield, driving a longsword into a towering horned beast with matted fur and glowing eyes, rain and sparks flying, ruined stone courtyard, ultra detailed.
11. A vast desert of towering sand dunes under a clear blue sky, a caravan of camels crossing in the distance.

## Paper appendix — extra gallery sheet 2

Source: `results/gallery_supp/prompts_v2.txt`

0. Photo of a person moving with motion blur, shot with a Leica M6 and VISION3 500T Color Negative Film, reminiscent of a Wong Kar Tai film set.
1. A group of figures are gathered at a table near a trellised terrace, overlooking a river with rowers and a boat. The scene, rendered in an Impressionistic style, employs loose brushstrokes and soft, diffused light. The man in the foreground, dressed in a blue and white striped shirt, gestures casually, holding what appears to be a cigarette. The table is set with wine bottles and glasses, indicating a leisurely gathering. Through the trellis, a glimpse of the river reveals rowers in action, with a lone figure in a boat further out. The greenery of the trellis and the river landscape blend, contributing to the painting's overall sense of depth and atmospheric perspective.
2. Tiny fluffy lamb standing on a fingertip, ultra-detailed wool texture, soft natural light.
3. funny Candid photo, cat sleeping across a man's eyes as he sleeps on his back, blocking his face, man is 25 years old, neck length frizzy black-brown hair, very unruly hair, stubble, wearing black dress pants, long sleeve white button up shirt, socks, laying on a post bed.
4. Golden-hour street photograph of a rain-soaked crosswalk in Tokyo, umbrellas and neon reflections, shot on Portra 400 with a 35mm Summicron, shallow depth of field.
5. Still life of a half-peeled orange, a silver knife and crumpled linen on a dark oak table, dramatic chiaroscuro in the style of a Dutch Golden Age painting.
6. Macro photograph of a honeybee landing on a lavender stalk, wings frozen mid-beat, pollen dust visible, creamy bokeh background.
7. An elderly fisherman mending a turquoise net on a stone pier at dawn, weathered hands in focus, oil painting with thick impasto strokes.
8. Candid photo of a golden retriever wearing reading glasses, asleep on an open newspaper in a sunlit kitchen, crumbs on the table.
9. A ballet dancer mid-leap backstage, caught in a slice of window light, dust motes in the air, black and white 35mm film grain.
10. Watercolor of a small harbor at low tide, fishing boats leaning on their keels, gulls overhead, loose washes and granulating pigment.
11. Close-up portrait of a woman in a mustard beret under falling snow, snowflakes caught on wool fibers and eyelashes, cinematic Kodachrome look.

## Paper appendix — extra gallery sheet 3

Source: `results/gallery_supp/prompts_v3.txt`

0. The nave of a Gothic cathedral at midday, light from a rose window scattering coloured lozenges across the stone floor, ribbed vaults receding into shadow, wide-angle architectural photograph.
1. A crowded morning market stall stacked with crates of pomegranates, figs and blood oranges, hand-lettered price cards tucked into the fruit, the vendor's arm reaching in, shot on medium format film.
2. Close-up of a vintage motorcycle engine, finned cylinder head and chrome exhaust, oil sheen and small scratches in the metal, workshop light raking across it.
3. A peacock displaying its tail on a lawn, every eyespot and barb rendered, iridescent teal and gold, overcast light, telephoto compression.
4. Rush hour in a grand railway station, dozens of commuters in motion beneath a vaulted iron-and-glass roof, departure boards glowing, seen from a high vantage point.
5. Macro photograph of a hand-knotted Persian rug, individual wool knots and the medallion pattern visible, raking light showing the depth of the pile.
6. A coral reef wall in clear water, anthias swarming above staghorn coral, sea fans and a passing sea turtle, natural light falling from above.
7. Reflection in an astronaut's gold visor: the surface of Mars, a rover in the middle distance, and the astronaut's own gloved hand raised, ultra-detailed.
8. A luthier's workshop with a half-finished violin clamped on the bench, curls of wood shavings, chisels laid out in a row, warm afternoon light through a dusty window.
9. An alpine village under fresh snow at blue hour, timber chalets with lit windows, a church steeple, jagged mountains behind, long-exposure photograph.
10. A chameleon gripping a thin branch, individual scales and the curl of its tail in focus, shallow depth of field, dense jungle background.
11. A tabletop covered with vintage typewriters and stacks of typed pages, keys and typebars catching the light, black and white photograph.

## Paper appendix — extra gallery sheet 4

Source: `results/gallery_supp/prompts_v4.txt`

0. Hot-air balloons rising over Cappadocia at sunrise, dozens of envelopes in scarlet, turquoise and marigold stripes, rock chimneys below, clear golden light.
1. A Holi festival at midday, a crowd mid-throw in clouds of magenta, saffron and cyan powder, wet colour on faces and white shirts, sunlight through the haze.
2. Close-up wildlife photograph of a scarlet macaw, head and shoulder filling the frame, individual feather barbs and the fine white lines of the bare facial skin visible, sharp catchlight in the eye, telephoto lens at f/4, rainforest foliage thrown far out of focus behind.
3. Endless tulip fields in full bloom, banded rows of red, pink, orange and violet running to a white windmill under a blue sky with fair-weather clouds.
4. A fairground carousel at dusk, painted horses with gilded poles, hundreds of warm bulbs and candy-striped canopy, long exposure with the crowd blurred.
5. A candy shop counter lined with glass jars of striped humbugs, gummy bears and rainbow lollipops, pastel shelves behind, bright even light.
6. Day of the Dead alebrijes on a market table, carved wooden creatures painted in electric turquoise, pink and lime with fine dot-and-line patterns, marigolds around them.
7. A surfer carving the face of a turquoise wave, spray fanning into a rainbow, bright tropical daylight, water droplets frozen mid-air.

## Paper appendix — extra gallery sheet 5

Source: `results/gallery_supp/prompts_v5.txt`

0. A peloton of racing cyclists sweeping through a sunlit corner, sponsor jerseys and spoked wheels sharp, bright midday light, photographed with a fast telephoto lens.
1. A tennis player mid-serve on a blue hard court in bright sunlight, racket strings and the taut net mesh sharp, spectators soft in the background.
2. A sushi platter on white marble under bright studio light, individual rice grains, salmon roe and thin slices of ginger in sharp focus.
3. A golden retriever running through shallow turquoise sea water, spray frozen in the air, wet fur detail, bright midday sun.
4. A Paris cafe terrace at midday, rattan chairs with woven backs, small round marble tables, people in summer clothes, bright even sunlight.
5. Rows of pastel macarons in a patisserie window, ruffled feet and smooth shells, bright daylight through the glass.
6. A hummingbird hovering at a red feeder in a bright garden, wings blurred by motion, iridescent throat feathers sharp, clear daylight.
7. A red vintage convertible parked on a sunny coastal road, chrome trim and wire wheels catching the light, blue sea behind.
