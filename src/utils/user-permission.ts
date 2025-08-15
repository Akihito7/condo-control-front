import { useUserContext } from "@/providers/use-user-context";

export function userPermission({ pageId }: { pageId: number }) {

  const { user } = useUserContext();
  console.log("its me user", user)
  const userPermissionToThisPage = user.pagesWithPermissionByRole?.find(
    (page) => page.pageId === pageId
  );

  if (!userPermissionToThisPage) {
    return {
      pageId: -1,
      roleName: user.userAssociationRole,
      read: false,
      write: false,
      edit: false,
      delete: false,
      pageName: '',
      pageModuleId: -1,
      pageCreatedAt: '',
      pageRoutePath: '',
      pageUpdatedAt: '',
    }
  }

  return userPermissionToThisPage;
}