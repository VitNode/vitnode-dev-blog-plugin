import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'vitnode-frontend/components/ui/alert-dialog';
import { Button } from 'vitnode-frontend/components/ui/button';
import { TooltipWrapper } from 'vitnode-frontend/components/ui/tooltip';
import { useTextLang } from 'vitnode-frontend/hooks/use-text-lang';

import { ContentDeleteItemArticlesBlogAdmin } from './content';

export const DeleteItemArticlesBlogAdmin = (
  props: React.ComponentProps<typeof ContentDeleteItemArticlesBlogAdmin>,
) => {
  const t = useTranslations('admin_blog.articles.delete');
  const tGlobal = useTranslations('core.global');
  const { convertText } = useTextLang();

  return (
    <AlertDialog>
      <TooltipWrapper content={t('title')}>
        <AlertDialogTrigger asChild>
          <Button ariaLabel={t('title')} size="icon" variant="destructiveGhost">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
      </TooltipWrapper>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tGlobal('are_you_sure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.rich('desc', {
              title: () => (
                <span className="text-foreground font-semibold">
                  {convertText(props.title)}
                </span>
              ),
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ContentDeleteItemArticlesBlogAdmin {...props} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
