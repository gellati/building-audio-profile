#/usr/bin/python
"""
Make annoying noises from building drawings
"""

#import modules
import os, pygame
from scipy import misc


# globals
imagesource1=os.path.join('resources',  'overheadlines_02.jpg')
blob1image= pygame.image.load(imagesource1)
arr = misc.imread(imagesource1)

print len(arr)
print arr.shape
print arr.shape[0]
print arr.shape[1]


#define the classes for our game objects

class strobe(pygame.sprite.Sprite):
    ''' displays the moving strobe line and triggers playing notes'''
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.imagesource=os.path.join('resources',  'strobe.png')
        self.image= pygame.image.load(self.imagesource)
        print self.image.get_rect().size
        print self.image.get_rect().width
        self.rect=self.image.get_rect()
        self.xpos=0
        self. tempo=5

    def update(self):
        self.xpos += self.tempo
        if self.xpos>=arr.shape[1]:
            self.xpos=0
        self.rect.left=self.xpos

class blob(pygame.sprite.Sprite):
    '''a simple blob, many of which make up our grid of noise'''
    def __init__(self):
        # we MUST call the Sprite init method on ourself
        pygame.sprite.Sprite.__init__(self)
        #load the image resource
        self.image=blob1image
        # get the rectangle describing the loaded image
        self.rect=self.image.get_rect()
        self.state= 0
    def toggle(self):
        self.state = 0
        self.image=blob1image


def main():
    """the main game logic"""
#Initialize Everything
    pygame.mixer.pre_init(44100,-16,2, 1024)
    pygame.init()
    pygame.mixer.set_num_channels(12)

    screensize=(arr.shape[1], arr.shape[0])
    screen = pygame.display.set_mode(screensize)
    pygame.display.set_caption('The amazing Buildingtron')
    pygame.mouse.set_visible(1)
    sounds=[]
    for item in range(12):
        source=os.path.join('resources',  'soundsquare'+str(item+1)+'.wav')
        sounds.append(pygame.mixer.Sound(source))

#    print sounds

    # set up a controlling timer for the game
    clock = pygame.time.Clock()

    #create sprite objects and add them to render groups
    spritegroup= pygame.sprite.RenderPlain()
    strobegroup= pygame.sprite.RenderPlain()
    s=strobe()
    s.add(strobegroup)
    cols = []
    newblob=blob()
    newblob.add(spritegroup)
    spritegroup.draw(screen)

    # control loop

    while 1:
        clock.tick(50)

        #check what events Pygame has caught
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                return
            elif event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                return
            elif event.type == pygame.MOUSEBUTTONDOWN:
                #determine row and column
                (mx,  my) = pygame.mouse.get_pos()
                mrow=int(my/50)
                mcol=int(mx/50)
                cols[mcol][mrow].toggle()

    #refresh the screen by drawing everything again

        strobegroup.update()
        spritegroup.draw(screen)
        strobegroup.draw(screen)
        pygame.display.flip()

        if not s.xpos % 50  and s.xpos < arr.shape[0]:
            print s.xpos
            print "sum: " + str(sum(sum(arr[s.xpos, :])) / len(sum(arr[s.xpos, :])))
#            print arr.shape
            if sum(sum(arr[s.xpos, :])) / len(sum(arr[s.xpos, :])) > 100:
#                sounds[1].play()
#                sounds[2].play()
#                sounds[3].play()
                sounds[4].play()
                sounds[5].play()





if __name__ == '__main__':
    main()
    pygame.quit()
