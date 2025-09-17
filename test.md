# === DEPLOY INSTRUCTIONS ===


cd /home/sumit


1 Backup existing files if already exits other go to step 2 (run as the user 'sumit'):
```sh
mv ~/.bashrc ~/.bashrc.bak
mv ~/.profile ~/.profile.bak
```



2 Create new files (open editor or paste contents):

```sh
vim ~/.bashrc
```

```sh


case "$-" in
    *i*) ;;
    *) return;;
esac

if [ -f /etc/bash.bashrc ]; then
    . /etc/bash.bashrc
fi

PS1='\u@\h:\w\$ '

alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'

[ -d "$HOME" ] && touch "$HOME/.bash_history" 2>/dev/null

: ${LC_ALL:=}
: ${LANG:=}

export LANG LC_ALL


```




```sh
vim ~/.profile
```

```sh


if [ -n "$BASH_VERSION" ]; then
    if [ -f "$HOME/.bashrc" ]; then
        . "$HOME/.bashrc"
    fi
fi

if [ -d "$HOME/.local/bin" ] ; then
    PATH="$HOME/.local/bin:$PATH"
fi
export PATH


```



3 Ensure correct ownership/permissions:
```sh
chown sumit:sumit ~/.bashrc ~/.profile
chmod 644 ~/.bashrc ~/.profile
```



4 Test locally (from another terminal) before closing existing sessions:
```sh
ssh sumit@62.72.59.27 "echo 'test OK' && id"
```


5 If something goes wrong, restore backups:
```sh
mv ~/.bashrc.bak ~/.bashrc
mv ~/.profile.bak ~/.profile
chown sumit:sumit ~/.bashrc ~/.profile
```
